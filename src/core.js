const Twit = require('twit');
const Stream = require('stream');
const os = require('os');
const wordingArray = require('../wording.json');

let drone;
let twit;
let stream;
let spinner;
let option;
let intervalCountdown;
let intervalRun;

/**
 * verify
 *
 * @since 2.0.0
 *
 * @return Promise
 */

function _verify()
{
	return new Promise((resolve, reject) =>
	{
		twit.get('account/verify_credentials', (error, data) =>
		{
			if (error)
			{
				reject(error);
			}
			else
			{
				drone =
				{
					userId: data.id_str,
					userName: data.name,
					description: data.description,
					followerCount: data.followers_count,
					friendCount: data.friends_count,
					tweetCount: data.statuses_count
				};
				resolve();
			}
		});
	});
}

/**
 * search the tweet
 *
 * @since 2.0.0
 *
 * @return Promise
 */

function _searchTweet()
{
	return twit.get('search/tweets',
	{
		q: option.get('search').query,
		count: option.get('search').query
	});
}

/**
 * search the user
 *
 * @since 2.0.0
 *
 * @return Promise
 */

function _searchUser()
{
	return twit.get('users/search',
	{
		q: option.get('search').query,
		count: option.get('search').query
	});
}

/**
 * list the follower
 *
 * @since 2.0.0
 *
 * @return Promise
 */

function _listFollower()
{
	return twit.get('followers/list',
	{
		count: option.get('list').count
	});
}

/**
 * list the friend
 *
 * @since 2.0.0
 *
 * @return Promise
 */

function _listFriend()
{
	return twit.get('friends/list',
	{
		count: option.get('list').count
	});
}

/**
 * list the tweet
 *
 * @since 2.0.0
 *
 * @return Promise
 */

function _listTweet()
{
	return twit.get('statuses/user_timeline',
	{
		count: option.get('list').count
	});
}

/**
 * list the retweet
 *
 * @since 2.0.0
 *
 * @return Promise
 */

function _listRetweet()
{
	return twit.get('statuses/retweets_of_me',
	{
		count: option.get('list').count
	});
}

/**
 * list the like
 *
 * @since 2.0.0
 *
 * @return Promise
 */

function _listLike()
{
	return twit.get('favorites/list',
	{
		count: option.get('list').count
	});
}

/**
 * tweet
 *
 * @since 2.0.0
 *
 * @param tweetId string
 * @param tweetText string
 *
 * @return Promise
 */

function _tweet(tweetId, tweetText)
{
	return new Promise((resolve, reject) =>
	{
		if (option.get('general').undoRun)
		{
			twit.post('statuses/destroy/' + tweetId, (error, data) =>
			{
				if (error)
				{
					spinner.fail(error);
					reject();
				}
				else
				{
					spinner.pass(data.text);
					resolve();
				}
			});
		}
		else
		{
			twit.post( 'statuses/update',
				{
					status: tweetText
				}, (error, data) =>
				{
					if (error)
					{
						spinner.fail(error);
						reject();
					}
					else
					{
						spinner.pass(data.text);
						resolve();
					}
				});
		}
	});
}

/**
 * retweet
 *
 * @since 2.0.0
 *
 * @param tweetId string
 *
 * @return Promise
 */

function _retweet(tweetId)
{
	return new Promise((resolve, reject) =>
	{
		twit.post(option.get('general').undoRun ? 'statuses/unretweet/' + tweetId : 'statuses/retweet/' + tweetId, (error, data) =>
		{
			if (error)
			{
				spinner.fail(error);
				reject();
			}
			else
			{
				spinner.pass(data.text);
				resolve();
			}
		});
	});
}

/**
 * like
 *
 * @since 2.0.0
 *
 * @param tweetId string
 *
 * @return Promise
 */

function _like(tweetId)
{
	return new Promise((resolve, reject) =>
	{
		twit.post(option.get('general').undoRun ? 'favorites/destroy' : 'favorites/create',
		{
			id: tweetId
		}, (error, data) =>
		{
			if (error)
			{
				spinner.fail(error);
				reject();
			}
			else
			{
				spinner.pass(data.text);
				resolve();
			}
		});
	});
}

/**
 * follow
 *
 * @since 2.0.0
 *
 * @param userId string
 *
 * @return Promise
 */

function _follow(userId)
{
	return new Promise((resolve, reject) =>
	{
		twit.post(option.get('general').undoRun ? 'friendships/destroy' : 'friendships/create',
		{
			id: userId
		}, (error, data) =>
		{
			if (error)
			{
				spinner.fail(error);
				reject();
			}
			else
			{
				spinner.pass(data.name);
				resolve();
			}
		});
	});
}

/**
 * parse the stream
 *
 * @since 2.0.0
 *
 * @return object
 */

function _parseStream(data)
{
	return data.toString('utf8').split(os.EOL).map(item => item ? JSON.parse(item) : null).filter(item => item);
}

/**
 * background run
 *
 * @since 1.0.0
 *
 * @param action string
 * @param backgroundInterval number
 */

function _backgroundRun(action, backgroundInterval)
{
	let countdown = backgroundInterval;

	clearInterval(intervalCountdown);
	clearInterval(intervalRun);

	/* handle interval */

	intervalCountdown = setInterval(() =>
	{
		spinner.start(wordingArray.drone_waiting + ' ' + countdown-- + ' ' + wordingArray.seconds + wordingArray.point);
	}, 1000);
	intervalRun = setInterval(() => run(action), backgroundInterval * 1000);
}

/**
 * dry run
 *
 * @since 1.0.0
 *
 * @param text string
 *
 * @return Promise
 */

function _dryRun(text)
{
	return new Promise(resolve =>
	{
		spinner.skip(text);
		resolve();
	});
}

/**
 * run
 *
 * @since 1.0.0
 *
 * @param action string
 */

function run(action)
{
	_verify()
		.then(() =>
		{
			spinner.start(wordingArray.drone_connected + wordingArray.exclamation_mark);
			if (action === 'search-tweet')
			{
				_searchTweet()
					.then(response =>
					{
						const dataArray = response.data && response.data.statuses ? response.data.statuses : [];
						let counter = 0;

						dataArray.map(status => stream.push(JSON.stringify(
						{
							count: counter++,
							tweetId: status.id_str,
							tweetText: status.text,
							userId: status.user.id_str,
							userName: status.user.name
						}) + os.EOL));
						stream.pipe(process.stdout);

						const backgroundRun = option.get('search').backgroundRun;
						const backgroundInterval = option.get('search').backgroundInterval;

						backgroundRun ? _backgroundRun('search-tweet', backgroundInterval) : spinner.stop();
					})
					.catch(error => spinner.fail(error));
			}
			else if (action === 'search-user')
			{
				_searchUser()
					.then(response =>
					{
						const dataArray = response.data ? response.data : [];
						let counter = 0;

						dataArray.map(user => stream.push(JSON.stringify(
						{
							count: counter++,
							userId: user.id_str,
							userName: user.name
						}) + os.EOL));
						stream.pipe(process.stdout);

						const backgroundRun = option.get('search').backgroundRun;
						const backgroundInterval = option.get('search').backgroundInterval;

						backgroundRun ? _backgroundRun('search-user', backgroundInterval) : spinner.stop();
					})
					.catch(error => spinner.fail(error));
			}
			else if (action === 'list-follower')
			{
				_listFollower()
					.then(response =>
					{
						const dataArray = response.data && response.data.users ? response.data.users : [];
						let counter = 0;

						dataArray.map(user => stream.push(JSON.stringify(
						{
							count: counter++,
							userId: user.id_str,
							userName: user.name
						}) + os.EOL));
						stream.pipe(process.stdout);

						const backgroundRun = option.get('list').backgroundRun;
						const backgroundInterval = option.get('list').backgroundInterval;

						backgroundRun ? _backgroundRun('list-follower', backgroundInterval) : spinner.stop();
					})
					.catch(error => spinner.fail(error));
			}
			else if (action === 'list-friend')
			{
				_listFriend()
					.then(response =>
					{
						const dataArray = response.data && response.data.users ? response.data.users : [];
						let counter = 0;

						dataArray.map(user => stream.push(JSON.stringify(
							{
								count: counter++,
								userId: user.id_str,
								userName: user.name
							}) + os.EOL));
						stream.pipe(process.stdout);

						const backgroundRun = option.get('list').backgroundRun;
						const backgroundInterval = option.get('list').backgroundInterval;

						backgroundRun ? _backgroundRun('list-friend', backgroundInterval) : spinner.stop();
					})
					.catch(error => spinner.fail(error));
			}
			else if (action === 'list-tweet')
			{
				_listTweet()
					.then(response =>
					{
						const dataArray = response.data ? response.data : [];
						let counter = 0;

						dataArray.map(status => stream.push(JSON.stringify(
							{
								count: counter++,
								tweetId: status.id_str,
								tweetText: status.text,
							}) + os.EOL));
						stream.pipe(process.stdout);

						const backgroundRun = option.get('list').backgroundRun;
						const backgroundInterval = option.get('list').backgroundInterval;

						backgroundRun ? _backgroundRun('list-tweet', backgroundInterval) : spinner.stop();
					})
					.catch(error => spinner.fail(error));
			}
			else if (action === 'list-like')
			{
				_listLike()
					.then(response =>
					{
						const dataArray = response.data ? response.data : [];
						let counter = 0;

						dataArray.map(status => stream.push(JSON.stringify(
						{
							count: counter++,
							tweetId: status.id_str,
							tweetText: status.text,
						}) + os.EOL));
						stream.pipe(process.stdout);


						const backgroundRun = option.get('list').backgroundRun;
						const backgroundInterval = option.get('list').backgroundInterval;

						backgroundRun ? _backgroundRun('list-like', backgroundInterval) : spinner.stop();
					})
					.catch(error => spinner.fail(error));
			}
			else
			{
				process.stdin.on('data', data =>
				{
					const dataArray = _parseStream(data);
					const dryRun = option.get('general').dryRun;

					if (action === 'tweet')
					{
						dataArray.map(data =>
						{
							if (data.tweetId && data.tweetText)
							{
								dryRun ? spinner.skip(data.tweetId) : _tweet(data.tweetId, data.tweetText);
							}
							else
							{
								spinner.warn(wordingArray.tweet_no)
							}
						});
					}
					if (action === 'retweet')
					{
						dataArray.map(data =>
						{
							if (data.tweetId)
							{
								dryRun ? spinner.skip(data.tweetId) : _retweet(data.tweetId);
							}
							else
							{
								spinner.warn(wordingArray.tweet_no)
							}
						});
					}
					if (action === 'like')
					{
						dataArray.map(data =>
						{
							if (data.tweetId)
							{
								dryRun ? spinner.skip(data.tweetId) : _like(data.tweetId);
							}
							else
							{
								spinner.warn(wordingArray.tweet_no)
							}
						});
					}
					if (action === 'follow')
					{
						dataArray.map(data =>
						{
							if (data.userId)
							{
								dryRun ? spinner.skip(data.userId) : _follow(data.tweetId);
							}
							else
							{
								spinner.warn(wordingArray.user_no)
							}
						});
					}
				});
			}
		})
		.catch(error => spinner.fail(error));
}

/**
 * init
 *
 * @since 2.0.0
 *
 * @param initArray array
 */

function init(initArray)
{
	twit = new Twit(initArray);
	stream = new Stream.PassThrough();
}

/**
 * construct
 *
 * @since 2.0.0
 *
 * @param injector object
 *
 * @return object
 */

function construct(injector)
{
	const exports =
	{
		init,
		run
	};

	/* handle injector */

	if (injector.spinner && injector.option)
	{
		spinner = injector.spinner;
		option = injector.option;
	}
	return exports;
}

module.exports = construct;