const fetch = require('node-fetch');

let credentialArray = [];
let authArray = [];

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
 * send get request
 *
 * @since 3.0.0
 *
 * @param route of the request
 * @param param array
 *
 * @return Promise
 */

function _get(route, paramArray)
{
	let params = new URLSearchParams();

	paramArray.map(paramValue => params = params.set(paramValue, paramArray[paramValue]));
	return fetch('https://api.twitter.com/1.1' + route,
	{
		method: 'GET',
		header: authArray.tokenType && authArray.accessToken ?
		{
			Authorization: authArray.tokenType +' ' + authArray.accessToken
		} : {},
		params
	});
}

/**
 * send post request
 *
 * @since 3.0.0
 *
 * @param route of the request
 * @param body array
 *
 * @return Promise
 */

function _post(route, bodyArray)
{
	return fetch('https://api.twitter.com/1.1' + route,
	{
		method: 'POST',
		header: authArray.tokenType && authArray.accessToken ?
		{
			Authorization: authArray.tokenType +' ' + authArray.accessToken
		} : {},
		body: JSON.stringify(bodyArray)
	});
}

/**
 * btoa
 *
 * @since 3.0.0
 *
 * @param input
 *
 * @return string
 */

function _btoa(input)
{
	return new Buffer(input).toString('base64');
}

/**
 * login
 *
 * @since 3.0.0
 *
 * @return Promise
 */

function login()
{
	return fetch('https://api.twitter.com/1.1/oauth2/token',
	{
		method: 'POST',
		headers: credentialArray.consumerKey && credentialArray.consumerSecret ?
		{
			Authorization: 'basic ' + _btoa(credentialArray.consumerKey + ':' + credentialArray.consumerSecret)
		} : {},
		body:
		{
			grant_type: 'client_credentials'
		}
	})
	.then(response =>
	{
		authArray =
		{
			accessToken: response.access_token,
			tokenType: response.token_type
		};
	});
}

/**
 * verify
 *
 * @since 3.0.0
 *
 * @return Promise
 */

function verify()
{
	new Promise((resolve, reject) =>
	{
		_get('/account/verify_credentials')
			.then(() => resolve())
			.catch(() => login()
				.then(() => resolve())
				.catch(() => reject())
			);
	});
}

/**
 * search the tweet
 *
 * @since 3.0.0
 *
 * @param optionArray array
 *
 * @return Promise
 */

function searchTweet(optionArray)
{
	return _get('/search/tweets',
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
 * @since 3.0.0
 *
 * @param optionArray array
 *
 * @return Promise
 */

function searchUser(optionArray)
{
	return _get('/users/search',
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
 * @since 3.0.0
 *
 * @param optionArray array
 *
 * @return Promise
 */

function listFollower(optionArray)
{
	return _get('/followers/list',
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
 * @since 3.0.0
 *
 * @param optionArray array
 *
 * @return Promise
 */

function listFriend(optionArray)
{
	return _get('/friends/list',
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
 * @since 3.0.0
 *
 * @param optionArray array
 *
 * @return Promise
 */

function listTweet(optionArray)
{
	return _get('/statuses/user_timeline',
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
 * @since 3.0.0
 *
 * @param optionArray array
 *
 * @return Promise
 */

function listLike(optionArray)
{
	return _get('/favorites/list',
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
 * @since 3.0.0
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
		return _post('/statuses/destroy/' + data.tweetId)
			.then(response =>
			{
				return response.data ? response.data : {};
			})
			.then(data => _reduceTweet(data));
	}
	return _post('/statuses/update',
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
 * @since 3.0.0
 *
 * @param data array
 * @param optionArray array
 *
 * @return Promise
 */

function retweet(data, optionArray)
{
	return _post(optionArray.undoRun ? '/statuses/unretweet/' + data.tweetId : '/statuses/retweet/' + data.tweetId)
		.then(response =>
		{
			return response.data ? response.data : {};
		})
		.then(data => _reduceTweet(data));
}

/**
 * like
 *
 * @since 3.0.0
 *
 * @param data array
 * @param optionArray array
 *
 * @return Promise
 */

function like(data, optionArray)
{
	return _post(optionArray.undoRun ? '/favorites/destroy' : '/favorites/create',
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
 * @since 3.0.0
 *
 * @param data array
 * @param optionArray array
 *
 * @return Promise
 */

function follow(data, optionArray)
{
	return _post(optionArray.undoRun ? '/friendships/destroy' : '/friendships/create',
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
 * @since 3.0.0
 *
 * @param init array
 */

function init(initArray)
{
	credentialArray = initArray;
}

module.exports =
{
	login,
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
