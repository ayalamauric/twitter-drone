const Twit = require('twit');

let twit;

/**
 * search the tweet
 *
 * @since 2.0.0
 *
 * @param optionArray array
 *
 * @return Promise
 */

function searchTweet(optionArray)
{
	return twit.get('search/tweets',
	{
		q: optionArray.query,
		count: optionArray.count
	})
	.then(response =>
	{
		return response.data && response.data.statuses ? response.data.statuses : []
	})
	.then(data =>
	{
		return data.map((statusValue, statusIndex) =>
		{
			const status =
			{
				count: statusIndex,
				tweetId: statusValue.id_str,
				tweetText: statusValue.text,
				userId: statusValue.user.id_str,
				userName: statusValue.user.name
			};

			return status;
		});
	})
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
}

module.exports =
{
	searchTweet,
	init
};
