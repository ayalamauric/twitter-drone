const Twit = require('twit');

let twit;

/**
 * verify
 *
 * @since 2.0.0
 *
 * @return Promise
 */

function verify()
{
	return twit.get('account/verify_credentials');
}

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
		return response.data && response.data.statuses ? response.data.statuses : [];
	})
	.then(data =>
	{
		return data.map((itemValue, itemIndex) =>
		{
			const item =
			{
				count: itemIndex,
				tweetId: itemValue.id_str,
				tweetText: itemValue.text,
				userId: itemValue.user.id_str,
				userName: itemValue.user.name
			};

			return item;
		});
	})
}

/**
 * search the user
 *
 * @since 2.0.0
 *
 * @param optionArray array
 *
 * @return Promise
 */

function searchUser(optionArray)
{
	return twit.get('users/search',
	{
		q: optionArray.query,
		count: optionArray.count
	})
	.then(response =>
	{
		return response.data ? response.data : [];
	})
	.then(data =>
	{
		return data.map((itemValue, itemIndex) =>
		{
			const item =
			{
				count: itemIndex,
				userId: itemValue.id_str,
				userName: itemValue.name
			};

			return item;
		});
	});
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
	verify,
	searchTweet,
	searchUser,
	init
};
