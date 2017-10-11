Twitter Drone
=============

> Dead simple bot to automate retweet, favorite and follow on Twitter.

[![Build Status](https://img.shields.io/travis/redaxmedia/twitter-drone.svg)](https://travis-ci.org/redaxmedia/twitter-drone)
[![Dependency Status](https://gemnasium.com/badges/github.com/redaxmedia/twitter-drone.svg)](https://gemnasium.com/github.com/redaxmedia/twitter-drone)
[![NPM Version](https://img.shields.io/npm/v/twitter-drone.svg)](https://www.npmjs.com/package/twitter-drone)
[![GitHub Stats](https://img.shields.io/badge/github-stats-ff5500.svg)](http://githubstats.com/redaxmedia/twitter-drone)


Installation
------------

```
npm install twitter-drone
```


Setup
-----

Define your environment variables inside the `.env` file:

```
TWITTER_CONSUMER_KEY=
TWITTER_CONSUMER_SECRET=
TWITTER_ACCESS_TOKEN=
TWITTER_ACCESS_TOKEN_SECRET=
TIMEOUT_MS=60000
```


Usage
-----

```
bin/twitter-drone [command] [options]

retweet
favorite
follow

-V, --version
-Q, --search_query <search_query>
-T, --search_type <search_type>
-L, --search_lang <search_lang>
-S, --search_count <search_count>
-R, --retweet_count <retweet_count>
-F, --favorite_count <favorite_count>
-I, --background_interval <background_interval>
-B, --background_run
-D, --dry_run
-h, --help
```


Examples
--------

Retweet popular `CSS` tweets:

```
bin/twitter-drone retweet --search_query=#css --search_type=popular
```

Favorite recent `PHP` tweets with at least 10 reweets:

```
bin/twitter-drone favorite --search_query=#php --retweet_count=10
```

Follow users of popular `HTML` tweets:

```
bin/twitter-drone follow --search_query=#html --search_type=popular
```