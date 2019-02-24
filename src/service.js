const Twit = require('twit');

let twit;

/**
 * map the tweet
 *
 * @since 2.0.0
 *
 * @param data array
 *
 * @return array
 */

function _mapTweet(data)
{
	return data.map((dataValue, dataIndex) =>
	{
		const result =
		{
			count: dataIndex,
			tweetId: dataValue.id_str,
			tweetText: dataValue.text,
			userId: dataValue.user.id_str,
			userName: dataValue.user.name
		};

		return result;
	});
}

/**
 * map the user
 *
 * @since 2.0.0
 *
 * @param data array
 *
 * @return array
 */

function _mapUser(data)
{
	return data.map((dataValue, dataIndex) =>
	{
		const result =
		{
			count: dataIndex,
			userId: dataValue.id_str,
			userName: dataValue.name
		};

		return result;
	});
}

/**
 * verify
 *
 * @since 2.0.0
 *
 * @return Promise
 */

function verify()
{
	return twit.get('account/verify_credentials')
		.then(response =>
		{
			return response.data ? response.data : {};
		})
		.then(data =>
		{
			const result =
			{
				userId: data.id_str,
				userName: data.name
			};

			return result;
		});
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
		return response.data && response.data.statuses ? response.data.statuses : {};
	})
	.then(data => _mapTweet(data));
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
		return response.data ? response.data : {};
	})
	.then(data => _mapUser(data));
}

/**
 * list the follower
 *
 * @since 2.0.0
 *
 * @param optionArray array
 *
 * @return Promise
 */

function listFollower(optionArray)
{
	return twit.get('followers/list',
	{
		count: optionArray.count
	})
	.then(response =>
	{
		return response.data && response.data.users ? response.data.users : {};
	})
	.then(data => _mapUser(data));
}

/**
 * list the friend
 *
 * @since 2.0.0
 *
 * @param optionArray array
 *
 * @return Promise
 */

function listFriend(optionArray)
{
	return twit.get('friends/list',
	{
		count: optionArray.count
	})
	.then(response =>
	{
		return response.data && response.data.users ? response.data.users : {};
	})
	.then(data => _mapUser(data));
}

/**
 * list the tweet
 *
 * @since 2.0.0
 *
 * @param optionArray array
 *
 * @return Promise
 */

function listTweet(optionArray)
{
	return twit.get('statuses/user_timeline',
	{
		count: optionArray.count
	})
	.then(response =>
	{
		return response.data ? response.data : {};
	})
	.then(data => _mapTweet(data));
}

/**
 * list the like
 *
 * @since 2.0.0
 *
 * @param optionArray array
 *
 * @return Promise
 */

function listLike(optionArray)
{
	return twit.get('favorites/list',
	{
		count: optionArray.count
	})
	.then(response =>
	{
		return response.data ? response.data : {};
	})
	.then(data => _mapTweet(data));
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
	listFollower,
	listFriend,
	listTweet,
	listLike,
	init
};
