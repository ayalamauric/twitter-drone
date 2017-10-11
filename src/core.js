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
	return new Promise((resolve, reject) =>
	{
		drone.get('account/verify_credentials', error =>
		{
			if (error)
			{
				reject(error);
			}
			else
			{
				resolve();
			}
		});
	});
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
		lang: option.get('search_lang'),
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
	const dryRun = option.get('dry_run');

	let promiseArray = [];

	/* process status */

	statusArray.forEach(statusValue =>
	{
		if (statusValue.retweet_count >= retweetCount && statusValue.favorite_count >= favoriteCount)
		{
			if (action === 'retweet')
			{
				promiseArray.push(dryRun ? _dryRun(statusValue.id_str) : _retweet(statusValue.id_str));
			}
			if (action === 'favorite')
			{
				promiseArray.push(dryRun ? _dryRun(statusValue.id_str) : _favorite(statusValue.id_str));
			}
			if (action === 'follow')
			{
				promiseArray.push(dryRun ? _dryRun(statusValue.user.id_str) : _follow(statusValue.user.id_str));
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
				const statusArray = _uniqueBy(response.data.statuses ? response.data.statuses : [], 'text');
				const promiseArray = _createPromiseArray(action, statusArray);

				Promise
					.all(promiseArray)
					.then(() => resolve())
					.catch(error => reject(error));
			})
			.catch(error => reject(error));
	});
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
		spinner.info(text);
		resolve();
	});
}

/**
 * background run
 *
 * @since 1.0.0
 *
 * @param action string
 * @param interval number
 */

function _backgroundRun(action, interval)
{
	let countdown = Math.ceil(interval / 1000);

	clearInterval(this.intervalCountdown);
	clearInterval(this.intervalRun);

	/* handle interval */

	this.intervalCountdown = setInterval(() =>
	{
		spinner.start(wordingArray.drone_waiting + ' ' + countdown-- + ' ' + wordingArray.seconds + wordingArray.point);
	}, 1000);
	this.intervalRun = setInterval(() => run(action), interval);
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
	const backgroundRun = option.get('background_run');
	const backgroundInterval = Math.abs(option.get('background_interval'));

	_verify()
		.then(() =>
		{
			spinner.start(wordingArray.drone_connected + wordingArray.exclamation_mark);
			_process(action)
				.then(() => backgroundRun ? _backgroundRun(action, backgroundInterval) : spinner.stop())
				.catch(() => spinner.stop());
		})
		.catch(error => spinner.fail(error));
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