const Twit = require('twit');
const Stream = require('stream');
const os = require('os');
const wordingArray = require('../wording.json');

let twit;
let stream;
let service;
let spinner;
let option;
let intervalCountdown;
let intervalRun;

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
 * pipe the data
 *
 * @since 2.0.0
 *
 * @return object
 */

function _pipeData(data)
{
	data.map(item => stream.push(JSON.stringify(item) + os.EOL));
	stream.pipe(process.stdout);
}

/**
 * parse from the stream
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
 * handle the action
 *
 * @since 2.0.0
 *
 * @param action string
 * @param optionArray array
 */

function _handleAction(action, optionArray)
{
	optionArray.backgroundRun ? _backgroundRun(action, optionArray) : spinner.stop();
}

/**
 * background run
 *
 * @since 1.0.0
 *
 * @param action string
 * @param optionArray array
 */

function _backgroundRun(action, optionArray)
{
	let countdown = optionArray.backgroundInterval;

	clearInterval(intervalCountdown);
	clearInterval(intervalRun);

	/* handle interval */

	intervalCountdown = setInterval(() =>
	{
		spinner.start(wordingArray.drone_waiting + ' ' + countdown-- + ' ' + wordingArray.seconds + wordingArray.point);
	}, 1000);
	intervalRun = setInterval(() => run(action), optionArray.backgroundInterval * 1000);
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
	service.verify()
		.then(() =>
		{
			spinner.start(wordingArray.drone_connected + wordingArray.exclamation_mark);
			if (action === 'search-tweet')
			{
				service
					.searchTweet(option.get('search'))
					.then(data =>
					{
						_pipeData(data);
						_handleAction(action, option.get('search'));
					})
					.catch(error => spinner.fail(error));
			}
			else if (action === 'search-user')
			{
				service
					.searchUser(option.get('search'))
					.then(data =>
					{
						_pipeData(data);
						_handleAction(action, option.get('search'));
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
								dryRun ? _dryRun(data.tweetId) : _tweet(data.tweetId, data.tweetText);
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
								dryRun ? _dryRun(data.tweetId) : _retweet(data.tweetId);
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
								dryRun ? _dryRun(data.tweetId) : _like(data.tweetId);
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
								dryRun ? _dryRun(data.userId) : _follow(data.tweetId);
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
	service.init(initArray);
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
		service = injector.service;
		spinner = injector.spinner;
		option = injector.option;
	}
	return exports;
}

module.exports = construct;