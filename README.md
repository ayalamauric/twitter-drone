Twitter Drone
=============

> Powerful bot to automate tweet, retweet, like and follow using newline delimited JSON streams.

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

Search for `CSS` related tweets and retweet them:

```
bin/twitter-drone search tweet --query=css | bin/twitter-drone retweet
```

Search for `HTML` related users and follow them:

```
bin/twitter-drone search user --query=html | bin/twitter-drone follow
```

List your likes and unlike them:

```
bin/twitter-drone list like | bin/twitter-drone like --undo-run
```

Fetch last commit from master, extract the message and tweet it:

```
curl https://api.github.com/repos/redaxmedia/twitter-drone/commits/master --silent |
jq '{tweetText: .commit.message}' |
tr --delete '\n' |
bin/twitter-drone tweet
```

Deployment
----------

Trigger [Deploy to Heroku](https://heroku.com/deploy?template=https://github.com/redaxmedia/twitter-drone) and fill out the form.
