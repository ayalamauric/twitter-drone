Twitter Drone
=============

> Dead simple bot to automate retweet, favorite and follow on Twitter.

[![Build Status](https://img.shields.io/travis/redaxmedia/twitter-drone.svg)](https://travis-ci.org/redaxmedia/twitter-drone)
[![Dependency Status](https://gemnasium.com/badges/github.com/redaxmedia/twitter-drone.svg)](https://gemnasium.com/github.com/redaxmedia/twitter-drone)
[![NPM Version](https://img.shields.io/npm/v/twitter-drone.svg)](https://www.npmjs.com/package/twitter-drone)
[![Deploy Heroku](https://img.shields.io/badge/deploy-heroku-7056bf.svg)](https://heroku.com/deploy?template=https://github.com/redaxmedia/twitter-drone)
[![GitHub Stats](https://img.shields.io/badge/github-stats-ff5500.svg)](http://githubstats.com/redaxmedia/twitter-drone)


Installation
------------

```
npm install twitter-drone
```


Setup
-----

Create a `.env` file to define your environment variables:

```
TWITTER_CONSUMER_KEY=
TWITTER_CONSUMER_SECRET=
TWITTER_ACCESS_TOKEN=
TWITTER_ACCESS_TOKEN_SECRET=
TWITTER_TIMEOUT_MS=
```


Usage
-----

```
bin/twitter-drone [command] [options]

retweet
favorite
follow

-V, --version
-Q, --search-query <search-query>
-T, --search-type <search-type>
-L, --search-lang <search-lang>
-S, --search-count <search-count>
-R, --retweet-count <retweet-count>
-F, --favorite-count <favorite-count>
-I, --background-interval <background-interval>
-B, --background-run
-D, --dry-run
-h, --help
```


Examples
--------

Retweet popular `CSS` tweets:

```
bin/twitter-drone retweet --search-query=css --search-type=popular
```

Favorite recent `PHP` tweets with at least 10 reweets:

```
bin/twitter-drone favorite --search-query=php --retweet-count=10
```

Follow users of popular `HTML` tweets:

```
bin/twitter-drone follow --search-query=html --search-type=popular
```


Deployment
----------

Trigger [Deploy to Heroku](https://heroku.com/deploy?template=https://github.com/redaxmedia/twitter-drone) and fill out the form.