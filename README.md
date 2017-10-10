Twitter Bot
===========

> Dead simple bot to automate retweet, favorite and follow on Twitter.

[![Build Status](https://img.shields.io/travis/redaxmedia/twitter-bot.svg)](https://travis-ci.org/redaxmedia/twitter-bot)
[![Dependency Status](https://gemnasium.com/badges/github.com/redaxmedia/twitter-bot.svg)](https://gemnasium.com/github.com/redaxmedia/twitter-bot)
[![NPM Version](https://img.shields.io/npm/v/twitter-bot.svg)](https://www.npmjs.com/package/twitter-bot)
[![GitHub Stats](https://img.shields.io/badge/github-stats-ff5500.svg)](http://githubstats.com/redaxmedia/twitter-bot)


Installation
------------

```
npm install twitter-bot
```


Setup
-----

Define your local environment using a `.env` file:

```
TWITTER_CONSUMER_KEY=***
TWITTER_CONSUMER_SECRET=***
TWITTER_ACCESS_TOKEN=***
TWITTER_ACCESS_TOKEN_SECRET=***
TIMEOUT_MS=60000
```


Usage
-----

```
bin/twitter-bot [options]

-V, --version
-Q, --search_query <search_query>
-T, --search_type <search_type>
-S, --search_count <search_count>
-R, --retweet_count <retweet_count>
-F, --favorite_count <favorite_count>
-h, --help
```


Examples
--------

Retweet popular `#CSS` tweets:

```
bin/twitter-bot --search_query=#CSS --search_type=popular
```

Retweet recent `#PHP` tweets with at least 10 reweets:

```
bin/twitter-bot --search_query=#PHP --search_type=recent --retweet_count=10
```