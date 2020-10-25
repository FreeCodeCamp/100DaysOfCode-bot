// Implementation of #100DaysOfCode Bot

console.log('==== #100DaysOfCode Bot Starting... ====')

// Import dependencies
const Twit = require('twit')
const schedule = require('node-schedule')

// Configuration
const config = require('./config')
const TwitterBot = new Twit(config.twitterKeys)

// API

const retweet = () => {
  const params = {
    q: config.twitterConfig.queryString,
    result_type: config.twitterConfig.result_type,
    lang: config.twitterConfig.lang
  }
  TwitterBot.get('search/tweets', params, (err, data) => {
    // when no errors
    if (!err) {
      let retweetID = data.statuses[0].id_str

      TwitterBot.post('statuses/retweet/:id', { id: retweetID }, (err, res) => {
        if (res) {
          console.log(`====> RETWEET SUCCESS ${retweetID}`)
        }
        if (err) {
          console.log(`====> ERROR in RETWEET ${err}`)
        }
      })
    } else {
      console.log(`====> ERROR ${err}`)
    }
  })
}

// Invoke API
retweet()
// 30 minutes
setInterval(retweet, 1800000)

// Slack Channel Promotion

const SLACKMESSAGE = `
Here's the link to the official #100DaysOfCode Slack Channel!
Join us to:
1) Get help
2) Help others
3) Connect
4) Discuss anything
https://100xcode.slack.com/join/shared_invite/enQtNzQwMzIwMzQxODc5LWQwMjU5Mjg0N2ZiMzIzYzJiZmE0YjNiYTBiZDBjNjlkNjBmMTYxNDBmNmE2YmE2YzY4NTgzY2Y5NDQxNWY5ZDM
`

const tweetSlackLink = () => {
  const tweet = `${SLACKMESSAGE}`
  TwitterBot.post('statuses/update', { status: tweet }, () => {
    console.log('SUCCESS: Slack Channel Link Sent')
  })
}

// Use cron-job to schedule Slack Channel Promotion
const rule = new schedule.RecurrenceRule()
rule.dayOfWeek = [0, new schedule.Range(1, 6)]
rule.hour = 11
rule.minute = 59

schedule.scheduleJob(rule, () => {
  // eslint-disable-next-line no-console
  console.log('Cron Job runs successfully')
  tweetSlackLink()
})
