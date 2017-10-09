const twit = require('twit');
const wordingArray = require('../wording.json');

let instance;
let option;

/**
 * verify
 *
 * @since 1.0.0
 *
 * @return Promise
 */

function verify()
{
	return instance.get('account/verify_credentials');
}

/**
 * search
 *
 * @since 1.0.0
 *
 * @return Promise
 */

function search()
{
	return instance.get('search/tweets',
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
 * @param id string
 *
 * @return Promise
 */

function retweet(id)
{
	return new Promise((resolve, reject) =>
	{
		instance.post('statuses/retweet/' + id)
			.then(() =>
			{
				process.stdout.write('.');
				resolve();
			})
			.catch(error =>
			{
				process.stderr.write(error + '\n');
				reject();
			});
	});
}

/**
 * process
 *
 * @since 1.0.0
 *
 * @return Promise
 */

function _process()
{
	return new Promise((resolve, reject) =>
	{
		let promiseArray = [];

		search()
			.then(response =>
			{
				if (response.data && response.data.statuses)
				{
					response.data.statuses.forEach(statusValue =>
					{
						if (statusValue.retweet_count >= option.get('retweet_count') && statusValue.favorite_count >= option.get('favorite_count'))
						{
							promiseArray.push(retweet(statusValue.id_str));
						}
					});

					/* handle all promises */

					Promise
						.all(promiseArray)
						.then(() =>
						{
							resolve();
						})
						.catch(error =>
						{
							process.stderr.write(error + '\n');
							reject();
						});
				}
			});
	});
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
	instance = new twit(initArray);
	verify()
		.then(() =>
		{
			process.stdout.write(wordingArray.bot_connected + wordingArray.exclamation_mark + '\n');
			_process()
				.then(() =>
				{
					process.stdout.write('\n');
				});
		})
		.catch(error =>
		{
			process.stderr.write(error + '\n');
		});
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
		init: init
	};

	/* inject dependency */

	if (dependency.option)
	{
		option = dependency.option;
	}
	return exports;
}

module.exports = construct;