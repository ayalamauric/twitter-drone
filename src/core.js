const wordingArray = require('../wording.json');

let stream;
let service;
let spinner;
let option;
let intervalCountdown;
let intervalRun;

/**
 * handle readable stream
 *
 * @since 2.0.0
 *
 * @param action string
 * @param optionArray array
 */

function _handleRead(action, optionArray)
{
	optionArray.backgroundRun ? _backgroundRun(action, optionArray) : spinner.stop();
}

/**
 * handle writeable stream
 *
 * @since 2.0.0
 *
 * @param data object
 * @param callback function
 * @param optionArray array
 */

function _handleWrite(data, callback, optionArray)
{
	optionArray.dryRun ? _dryRun(data) : callback(data, optionArray)
		.then(data => spinner.pass(JSON.stringify(data)))
		.catch(error => spinner.warn(error));
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
 * @param data string
 *
 * @return Promise
 */

function _dryRun(data)
{
	spinner.skip(JSON.stringify(data));
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
						stream.pipe(data);
						_handleRead(action, option.get('search'));
					})
					.catch(error => spinner.fail(error));
			}
			else if (action === 'search-user')
			{
				service
					.searchUser(option.get('search'))
					.then(data =>
					{
						stream.pipe(data);
						_handleRead(action, option.get('search'));
					})
					.catch(error => spinner.fail(error));
			}
			else if (action === 'list-follower')
			{
				service
					.listFollower(option.get('list'))
					.then(data =>
					{
						stream.pipe(data);
						_handleRead(action, option.get('list'));
					})
					.catch(error => spinner.fail(error));
			}
			else if (action === 'list-friend')
			{
				service
					.listFriend(option.get('list'))
					.then(data =>
					{
						stream.pipe(data);
						_handleRead(action, option.get('list'));
					})
					.catch(error => spinner.fail(error));
			}
			else if (action === 'list-tweet')
			{
				service
					.listTweet(option.get('list'))
					.then(data =>
					{
						stream.pipe(data);
						_handleRead(action, option.get('list'));
					})
					.catch(error => spinner.fail(error));
			}
			else if (action === 'list-like')
			{
				service
					.listLike(option.get('list'))
					.then(data =>
					{
						stream.pipe(data);
						_handleRead(action, option.get('list'));
					})
					.catch(error => spinner.fail(error));
			}
			else
			{
				const optionArray = option.get('general');
				let hasStream = false;
				let hasCommand = false;

				process.stdin.on('data', data =>
				{
					const dataArray = stream.parse(data);

					if (dataArray.length)
					{
						hasStream = true;
					}
					if (action === 'tweet')
					{
						hasCommand = true;
						dataArray.map(data => _handleWrite(data, service.tweet, optionArray));
					}
					if (action === 'retweet')
					{
						hasCommand = true;
						dataArray.map(data => _handleWrite(data, service.retweet, optionArray));
					}
					if (action === 'like')
					{
						hasCommand = true;
						dataArray.map(data => _handleWrite(data, service.like, optionArray));
					}
					if (action === 'follow')
					{
						hasCommand = true;
						dataArray.map(data => _handleWrite(data, service.follow, optionArray));
					}
				});
				process.stdin.on('end', () =>
				{
					if (!hasStream)
					{
						spinner.fail(wordingArray.stream_no + wordingArray.exclamation_mark);
					}
					else if (!hasCommand)
					{
						spinner.fail(wordingArray.command_no + wordingArray.exclamation_mark);
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

	if (injector.service && injector.stream && injector.spinner && injector.option)
	{
		service = injector.service;
		stream = injector.stream;
		spinner = injector.spinner;
		option = injector.option;
	}
	return exports;
}

module.exports = construct;