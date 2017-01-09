/**
 * DEPENDENCIES
 */
"use strict"; // added for use on c9

var twit = require('twit');
var config = require('./config');
var uniqueRandomArray = require('unique-random-array');


var Twitter = new twit(config);

var queryString = '#100DaysOfCode, #100daysofcode';

// Console Welcome Msg
console.log('Welcome to #100DaysOfCode');

// RETWEET
// find latest tweets according to #100daysofcode
var retweet = function () {
  var params = {
    q: queryString,
    result_type: 'recent',
    lang: 'en'
  };
  // for more parameters options, see: https://dev.twitter.com/rest/reference/get/search/tweets
  Twitter.get('search/tweets', params, function (err, data) {
    // if no errors
    if (!err) {
      // grab ID of tweet to retweet
      var retweetId = data.statuses[0].id_str;
      // Tell Twitter to retweet
      Twitter.post('statuses/retweet/:id', {
        id: retweetId
      }, function (err, response) {
        // if error while retweet
        if (err) {
          console.log('While Retweet. ERROR!...Maybe Duplicate Tweet');
        } else {
          console.log('Retweet. SUCCESS!');
        }

      });
    }
    // if unable to search a tweet
    else {
      console.log('Cannot Search Tweet. ERROR!');
    }
  });
};

retweet();
// retweet every 6 minutes
setInterval(retweet, 360000);

// FAVORITE ==============================
// find a random tweet using querySring and 'favorite' it
var favoriteTweet = function () {
  var params = {
    q: queryString,
    result_type: 'recent',
    lang: 'en'
  };
  // for more parameters, see: https://dev.twitter.com/rest/reference

  // find a tweet
  Twitter.get('search/tweets', params, function (err, data) {
    // find tweets randomly
    var tweet = data.statuses;
    var randomTweet = ranDom(tweet);    //pick a random tweet

    //if random tweet is found
    if (typeof randomTweet != 'undefined') {
      // Tell Twitter to 'favorite' it
      Twitter.post('favorites/create', { id: randomTweet.id_str }, function (err, response) {
        // if error while 'favorite'
        if (err) {
          console.log('Cannot Favorite. ERROR!');
        }
        else {
          console.log('Favorite Done. SUCCESS!');
        }
      });
    }
  });
};
// grab & 'favorite' a tweet ASAP program is running
favoriteTweet();
// 'favorite' a tweet every 12 minutes
setInterval(favoriteTweet, 720000);


// STREAM API for interacting with a USER =======
// set up a user stream
var userStream = Twitter.stream('user');

// REPLY-FOLLOW BOT ============================
// what to do when someone follows you?
userStream.on('follow', followed);

// ...trigger the callback
function followed(event) {
  console.log('Follow Event now RUNNING');
  // get USER's twitter handler (screen name)
  var name = event.source.name,
    screenName = event.source.screen_name;
  // function that replies back to every USER who followed for the first time
  tweetNow('@' + screenName + ' Thank you. What are you working on today?');
}

// function definition to tweet back to USER who followed
function tweetNow(tweetTxt) {
  var tweet = {
    status: tweetTxt
  };
  Twitter.post('statuses/update', tweet, function (err, data, response) {
    if (err) {
      console.log("Cannot Reply to Follower. ERROR!");
    }
    else {
      console.log('Reply to follower. SUCCESS!');
    }
  });
}

// Congratulation Messages for Day 1 & Day 100 ========
const hashtagStream = Twitter.stream('statuses/filter', {
  track: ['#100DaysOfCode']
});

// Function that checks if day 1 or day 100
hashtagStream.on('tweet', (tweet) => {
  if (checkIfLastDay(tweet)) {
    console.log(`Sending a congrats to @${tweet.user.screen_name}`)
    tweetNow(`WOOT! You did it @${tweet.user.screen_name}! Party Time!`)
  } else if (checkIfFirstDay(tweet)) {
    console.log(`Sending a congrats to @${tweet.user.screen_name}`)
    tweetNow(`Congrats on your first day @${tweet.user.screen_name}! Keep it up!`)
  };
})

// NOTE: String elements in firstDay & lastDay are case insensitive

function checkIfFirstDay(tweet) {
  const firstDay = ['#day01', '#day1 ', 'first day', 'day 1', 'day one', '1/100'];
  console.log(`Checking if first day`)
  for (let i = 0; i < firstDay.length; i++) {
    if (checkTweetForText(tweet.text, firstDay[i])) {
      return true;
    }
  }
}

function checkIfLastDay(tweet) {
  const lastDay = ['#day100', 'final day', 'day 100', 'one hundred', '100/100'];
  console.log(`Checking if Last day`)
  for (let i = 0; i < lastDay.length; i++) {
    if (checkTweetForText(tweet.text, lastDay[i])) {
      return true;
    }
  }
}

function checkTweetForText(tweetText, value){
  return tweetText.toLowerCase().indexOf(value) > -1 && tweetText.toLowerCase().indexOf('100daysofcode') > -1
}

function ranDom(arr) {
  var index = Math.floor(Math.random() * arr.length);
  return arr[index];
}

function tweetProjectOfTheDay() {

  var projectOfTheDay = uniqueRandomArray([
    'Build a Random Quote Machine',
    'Show the Local Weather',
    'Build a Wikipedia Viewer',
    'Use the Twitch.tv JSON API',
    'Build a JavaScript Calculator',
    'Build a Pomodoro Clock',
    'Build a Tic Tac Toe Game',
    'Build a Simon Game'
  ]);

  var message = 'Looking for inspitation for your #100DaysOfCode? Why not try ' + projectOfTheDay()

  Twitter.post('statuses/update', { status: message }, function(err, data, response) {
    console.log('POST PROJECT OF THE DAY!')
  })

}

// post random project of the day
tweetProjectOfTheDay();
// post sample project every 24 hours
setInterval(tweetProjectOfTheDay, 86400000);
