const twit = require('twit');
const ora = require('ora');
const wordingArray = require('../wording.json');

let drone;
let spinner;
let option;

/**
 * verify
 *
 * @since 1.0.0
 *
 * @return Promise
 */

function _verify()
{
	return drone.get('account/verify_credentials');
}

/**
 * search
 *
 * @since 1.0.0
 *
 * @return Promise
 */

function _search()
{
	return drone.get('search/tweets',
	{
		q: option.get('search_query'),
		result_type: option.get('search_type'),
		count: option.get('search_count')
	});
}

/**
 * retweet
 *
 * @since 1.0.0
 *
 * @param tweetId string
 *
 * @return Promise
 */

function _retweet(tweetId)
{
	return new Promise((resolve, reject) =>
	{
		drone.post('statuses/retweet/' + tweetId, (error, data) =>
		{
			if (error)
			{
				spinner.fail(error);
				reject();
			}
			else
			{
				spinner.succeed(data.text);
				resolve();
			}
		});
	});
}

/**
 * favorite
 *
 * @since 1.0.0
 *
 * @param tweetId string
 *
 * @return Promise
 */

function _favorite(tweetId)
{
	return new Promise((resolve, reject) =>
	{
		drone.post('favorites/create',
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
				spinner.succeed(data.text);
				resolve();
			}
		});
	});
}

/**
 * follow
 *
 * @since 1.0.0
 *
 * @param userId string
 *
 * @return Promise
 */

function _follow(userId)
{
	return new Promise((resolve, reject) =>
	{
		drone.post('friendships/create',
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
				spinner.succeed(data.name);
				resolve();
			}
		});
	});
}

/**
 * create promise array
 *
 * @since 1.0.0
 *
 * @param action string
 * @param statusArray array
 *
 * @return array
 */

function _createPromiseArray(action, statusArray)
{
	const retweetCount = option.get('retweet_count');
	const favoriteCount = option.get('favorite_count');

	let promiseArray = [];

	/* process status */

	statusArray.forEach(statusValue =>
	{
		if (statusValue.retweet_count >= retweetCount && statusValue.favorite_count >= favoriteCount)
		{
			if (action === 'retweet')
			{
				promiseArray.push(_retweet(statusValue.id_str));
			}
			if (action === 'favorite')
			{
				promiseArray.push(_favorite(statusValue.id_str));
			}
			if (action === 'follow')
			{
				promiseArray.push(_follow(statusValue.user.id_str));
			}
		}
	});
	return promiseArray;
}


/**
 * unique by
 *
 * @since 1.0.0
 *
 * @param rawArray array
 * @param key string
 *
 * @return Promise
 */

function _uniqueBy(rawArray, key)
{
	return rawArray.filter((first, index) => rawArray.findIndex(second => first[key] === second[key]) === index);
}

/**
 * process
 *
 * @since 1.0.0
 *
 * @param action string
 *
 * @return Promise
 */

function _process(action)
{
	return new Promise((resolve, reject) =>
	{
		_search()
			.then(response =>
			{
				const statusArray = _uniqueBy(response.data.statuses, 'text');
				const promiseArray = _createPromiseArray(action, statusArray);

				Promise
					.all(promiseArray)
					.then(() => resolve())
					.catch(() => reject());
			});
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
			spinner.start(wordingArray.bot_connected + wordingArray.exclamation_mark);
			_process(action)
				.then(() => spinner.stop())
				.catch(() => spinner.stop());
		})
		.catch(() => spinner.stop());
}

/**
 * init
 *
 * @since 1.0.0
 *
 * @param initArray array
 */

function init(initArray)
{
	drone = new twit(initArray);
	spinner = ora(wordingArray.please_wait + wordingArray.point.repeat(3)).start();
}

/**
 * construct
 *
 * @since 1.0.0
 *
 * @param dependency object
 *
 * @return object
 */

function construct(dependency)
{
	const exports =
	{
		init: init,
		run: run
	};

	/* inject dependency */

	if (dependency.option)
	{
		option = dependency.option;
	}
	return exports;
}

module.exports = construct;