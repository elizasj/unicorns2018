---
date: '2017-03-31T00:00:00Z'
tags: ['javascript', 'APIs', 'data', 'bots']
title: 'Building @weizenbaumbot'
category: 'creative dev'
---

My first encounter with Twitter bots happened last year via Python and involved my building a bot that would receive tweets with a specific hashtag and photo attached, apply an instagram-like filter to it, and retweet the user with the new photo. It was a fun first pass at getting my hands dirty with [**Twitter's streaming API**](https://dev.twitter.com/streaming/overview) (which of all it's API's might actually be the least obvious one to use... I thought I was struggling because #n00b, etc. but a number of more experienced coders have since reassured me that it's not just me. Wee!)

For my second pass at bot-building things went a little differently. Firstly, when it came to deciding on the botiness of the bot itself, I opted for language processing over image processing. This was for no other reason than I've been looking for an excuse to build something with ELIZA, one of the earliest known natural language processing computer programs created ('64) (_and also my name_)

Funnily enough I was introduced to ELIZA in my teens when a computer engineer friend of mine pointed out that much like the software version, irl Eliza was a good listener too. While I'll totally take the compliment, I much prefer the story behind the program itself: ELIZA was developed by J. Weizenbaum in part to show that communication between man and machine could only ever be superficial in nature. Turns out he wasn't as right as he thought because a large enough number of users attributed human-like feelings to the program with some, (his secretary included,) becoming convinced the program was some sort of AI. I find the whole idea pretty captivating - if you do too, [follow this link](https://en.wikipedia.org/wiki/ELIZA).

While I still use Python a lot, since I usually reserve Javascript for playing around with layout and dynamic visuals, I wanted to try and build this bot with JS. Of course, I have to give credit where it's due:
[Dan Shiffman](https://twitter.com/shiffman) does a great job of introducing node's Twitter API Client, [**Twit**](https://www.npmjs.com/package/twit), which adds a hugely appreciated layer of obviousness to the whole endeavour:

```javascript
var Twit = require('twit')
var config = require('./config')
var T = new Twit(config)
var stream = T.stream('user')
stream.on('follow', followed)

function followed(eventMsg) {
  // ...
}
```

ELIZA was pretty simple to set up. NPM offers a number of different takes on Weizenbaum's chatbot, but I found [**Elizanode**](https://www.npmjs.com/package/elizanode) to be the most straightforward to apply.

```javascript
var ElizaNode = require('elizanode')
var eliza = new ElizaNode()
var initial = eliza.getInitial()
var reply = eliza.transform(inputtext)
```

I built the bot to interact with users based on how you interact with it: on follow or first **@**, the bot's introductory interactions are triggered (via `Eliza.getInitial()`) and if you reply to the bot, and therefore have a running thread, **Elizanode** will analyse and respond to your tweet accordingly.

Simple enough... but wait! How do you achieve threaded responses? It's a pretty important question if you want to avoid Twitter shutting down your bot for starting too many conversations or seeming like it's tweeting people out of the blue.

As you might have guessed it comes down to twitter message id's. But if you look at the JSON Twitter gives you, things are not necessarily so obvious. Case in point:

```javascript
{
  "created_at": "Fri Mar 31 10:55:49 +0000 2017",
  "id": 847764363163422700,
  "id_str": "847764363163422720",
  "text": "emoji unicode: 1f914 @iamelizasj What do you think?",
  "source": "<a href=\"https://github.com/elizasj\" rel=\"nofollow\">weizenbaumbot</a>",
  "truncated": false,
  "in_reply_to_status_id": 847764357438111700,
  "in_reply_to_status_id_str": "847764357438111744",
  "in_reply_to_user_id": 16942458,
  "in_reply_to_user_id_str": "16942458",
  "in_reply_to_screen_name": "iamelizasj",
  "user": {
    "id": 842092565360971800,
    "id_str": "842092565360971778",
    "name": "eliza",
    "screen_name": "weizenbaumbot",
    "location": null,
    "url": "http://bit.ly/weizenbaumbot",
    "description": "ELIZA was created by Joseph Weizenbaum to demonstrate the superficiality of communication between man and machine.  MIT AI Lab, '64-66",
    "protected": false,
    "verified": false,
    "followers_count": 10,
    "friends_count": 24,
    "listed_count": 0,
    "favourites_count": 3,
    "statuses_count": 205,
    "created_at": "Wed Mar 15 19:18:07 +0000 2017",
    "utc_offset": null,
    "time_zone": null,
    "geo_enabled": false,
    "lang": "en",
    "contributors_enabled": false,
    "is_translator": false,
    "profile_background_color": "000000",
    "profile_background_image_url": "http://abs.twimg.com/images/themes/theme1/bg.png",
    "profile_background_image_url_https": "https://abs.twimg.com/images/themes/theme1/bg.png",
    "profile_background_tile": false,
    "profile_link_color": "D5B6C9",
    "profile_sidebar_border_color": "000000",
    "profile_sidebar_fill_color": "000000",
    "profile_text_color": "000000",
    "profile_use_background_image": false,
    "profile_image_url": "http://pbs.twimg.com/profile_images/847450078348324865/l_LTIK5w_normal.jpg",
    "profile_image_url_https": "https://pbs.twimg.com/profile_images/847450078348324865/l_LTIK5w_normal.jpg",
    "profile_banner_url": "https://pbs.twimg.com/profile_banners/842092565360971778/1490884263",
    "default_profile": false,
    "default_profile_image": false,
    "following": null,
    "follow_request_sent": null,
    "notifications": null
  },
  "geo": null,
  "coordinates": null,
  "place": null,
  "contributors": null,
  "is_quote_status": false,
  "retweet_count": 0,
  "favorite_count": 0,
  "entities": {
    "hashtags": [],
    "urls": [],
    "user_mentions": [
      {
        "screen_name": "iamelizasj",
        "name": "emoji unicode: 2728¯\\_emoji unicode: 1f913_/¯emoji unicode: 2728",
        "id": 16942458,
        "id_str": "16942458",
        "indices": [
          2,
          13
        ]
      }
    ],
    "symbols": []
  },
  "favorited": false,
  "retweeted": false,
  "filter_level": "low",
  "lang": "en",
  "timestamp_ms": "1490957749535"
}
```

Right off the bat, we can write off the id's and everything else provided under `user`, because it refers to the bot itself and we definitely want to avoid replying to ourselves. What we're looking for is the id of the tweet that we are replying to, so that our interactions are stacked, or threaded.

I first confused myself into thinking `in_reply_to_user_id` would do the trick, which landed me at my first roadblock: did you know that certain programming languages (like Javascript ) don't support numbers with > 53-bits ? Turns out that the numeric JSON values in our Twitter stream data exceed the accepted amount of bits... Ugh. But not to worry because if you look just underneath `in_reply_to_user_id`, you'll see that Twitter provides us with a very handy `in_reply_to_user_id_str` which basically sideskirts the whole problem.

But still, at this point my bot was replying on loop, every second. Which is definitely not what I wanted. I had achieved the threaded reply's I was looking for but my bot would continuously tweet a response until everything crashed because there was a duplicate status.

By using `in_reply_to_user_id_str` I'd created a reply loop that had the bot continuously tweeting at and therefore soliciting itself. In fact, it's the `id_str` way up at the top of the JSON file that I needed:

```javascript
function tweetEvent(eventMsg) {
  //twitter data
  var screenName = eventMsg.source.screen_name
  var replyto = eventMsg.in_reply_to_screen_name
  var replyid = eventMsg.id_str
  var text = eventMsg.text
  var from = eventMsg.user.screen_name

  if (replyto === 'weizenbaumbot' && replyid != null) {
    // elizanode takes user reply
    var reply = eliza.transform(text)

    // reply
    var newtweet = 'emoji unicode: 1f914 @' + from + ' ' + reply
    tweetIt(newtweet, replyid)
  } else if (replyto === 'weizenbaumbot' && replyid === null) {
    console.log('this reply id should be null: ' + replyid)
    // elizanode initialized
    var initial = eliza.getInitial()

    // reply
    var newtweet = 'emoji unicode: 1f6cb @' + from + ' ' + initial
    tweetIt(newtweet)
  }
}

function tweetIt(txt, replyid = null) {
  var tweet = {
    status: txt,
    in_reply_to_status_id: replyid,
  }

  T.post('statuses/update', tweet, tweeted)
  function tweeted(err, data, response) {
    if (err) {
      console.log('error message: ' + err.allErrors)
    } else {
      console.log('Things are looking good...')
    }
  }
}
```

The amount of roadblocks you'll hit is pretty dependant on how boty you make your Twitter bot. In my case, this was the only hiccup I encountered! My bot is pretty simple, it's true, but most Twitter bots are. They're fun and simple living projects to take on, especially if you're curious about how to use data to power your projects.
