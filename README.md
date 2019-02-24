Twitter Drone
=============

> JSON stream enhanced bot to automate tweet, retweet, like and follow on Twitter.

[![Build Status](https://img.shields.io/travis/redaxmedia/twitter-drone.svg)](https://travis-ci.org/redaxmedia/twitter-drone)
[![NPM Version](https://img.shields.io/npm/v/twitter-drone.svg)](https://npmjs.com/package/twitter-drone)
[![License](https://img.shields.io/npm/l/twitter-drone.svg)](https://npmjs.com/package/twitter-drone)
[![Deploy Heroku](https://img.shields.io/badge/deploy-heroku-7056bf.svg)](https://heroku.com/deploy?template=https://github.com/redaxmedia/twitter-drone)


Preview
-------

![Terminal Session](https://cdn.rawgit.com/redaxmedia/media/master/twitter-drone/terminal-session.svg)


Installation
------------

Clone the repository:

```
git clone https://github.com/redaxmedia/twitter-drone.git
```

Install the dependencies:

```
npm install
```


Setup
-----

Create a `.env` file to define your environment variables:

```
TWITTER_API_KEY=
TWITTER_API_KEY_SECRET=
TWITTER_ACCESS_TOKEN=
TWITTER_ACCESS_TOKEN_SECRET=
```


Usage
-----

Combine readable streams `search` and `list` with writable streams `tweet`, `retweet`, `like` and `follow`:

```
bin/twitter-drone [command] [options]

-V, --version
-h, --help

search [tweet] [user]

-Q, --query <query>
-C, --count <count>
-I, --background-interval <background-interval>
-B, --background-run

list [follower] [friend] [tweet] [like]

-C, --count <count>
-I, --background-interval <background-interval>
-B, --background-run

tweet
retweet
like
follow

-U, --undo-run
-D, --dry-run
```


Examples
--------

Search for `CSS` tweets and retweet them:

```
bin/twitter-drone search tweet --query=css | bin/twitter-drone retweet
```

Search for `PHP` users and favorite them:

```
bin/twitter-drone search user --query=php | bin/twitter-drone favorite
```

Search for users of `HTML` tweets and follow them:

```
bin/twitter-drone search tweet --query=html | bin/twitter-drone follow
```


Deployment
----------

Trigger [Deploy to Heroku](https://heroku.com/deploy?template=https://github.com/redaxmedia/twitter-drone) and fill out the form.
