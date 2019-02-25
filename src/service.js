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
			userName: dataValue.user.screen_name
		};

		return result;
	});
}

/**
 * reduce the tweet
 *
 * @since 2.0.0
 *
 * @param data array
 *
 * @return array
 */

function _reduceTweet(data)
{
	const result =
	{
		tweetId: data.id_str,
		tweetText: data.text,
		userId: data.user.id_str,
		userName: data.user.screen_name
	};

	return result;
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
			userName: dataValue.screen_name
		};

		return result;
	});
}

/**
 * reduce the user
 *
 * @since 2.0.0
 *
 * @param data array
 *
 * @return array
 */

function _reduceUser(data)
{
	const result =
	{
		userId: data.id_str,
		userName: data.screen_name
	};

	return result;
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
	return twit
		.get('account/verify_credentials')
		.then(response =>
		{
			return response.data ? response.data : {};
		})
		.then(data => _reduceUser(data));
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
	return twit
		.get('search/tweets',
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
	return twit
		.get('users/search',
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
	return twit
		.get('followers/list',
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
	return twit
		.get('friends/list',
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
	return twit
		.get('statuses/user_timeline',
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
	return twit
		.get('favorites/list',
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
 * tweet
 *
 * @since 2.0.0
 *
 * @param data array
 * @param optionArray array
 *
 * @return Promise
 */

function tweet(data, optionArray)
{
	if (optionArray.undoRun)
	{
		return twit
			.post('statuses/destroy/' + data.tweetId)
			.then(response =>
			{
				return response.data ? response.data : {};
			})
			.then(data => _reduceTweet(data));
	}
	return twit
		.post('statuses/update',
		{
			status: data.tweetText
		})
		.then(response =>
		{
			return response.data ? response.data : {};
		})
		.then(data => _reduceTweet(data));
}

/**
 * retweet
 *
 * @since 2.0.0
 *
 * @param data array
 * @param optionArray array
 *
 * @return Promise
 */

function retweet(data, optionArray)
{
	return twit
		.post(optionArray.undoRun ? 'statuses/unretweet/' + data.tweetId : 'statuses/retweet/' + data.tweetId)
		.then(response =>
		{
			return response.data ? response.data : {};
		})
		.then(data => _reduceTweet(data));
}

/**
 * like
 *
 * @since 2.0.0
 *
 * @param data array
 * @param optionArray array
 *
 * @return Promise
 */

function like(data, optionArray)
{
	return twit
		.post(optionArray.undoRun ? 'favorites/destroy' : 'favorites/create',
		{
			id: data.tweetId
		})
		.then(response =>
		{
			return response.data ? response.data : {};
		})
		.then(data => _reduceTweet(data));
}

/**
 * follow
 *
 * @since 2.0.0
 *
 * @param data array
 * @param optionArray array
 *
 * @return Promise
 */

function follow(data, optionArray)
{
	return twit
		.post(optionArray.undoRun ? 'friendships/destroy' : 'friendships/create',
		{
			id: data.userId
		})
		.then(response =>
		{
			return response.data ? response.data : {};
		})
		.then(data => _reduceUser(data));
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
	tweet,
	retweet,
	like,
	follow,
	init
};
