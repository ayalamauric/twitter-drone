const dotenv = require('dotenv');
const drone = require('../');
const core = drone.core;
const spinner = drone.spinner;
const option = drone.option;

let CORE;

beforeEach(() =>
{
	dotenv.config();
	if (process.env.TWITTER_API_KEY &&
		process.env.TWITTER_API_KEY_SECRET &&
		process.env.TWITTER_ACCESS_TOKEN &&
		process.env.TWITTER_ACCESS_TOKEN_SECRET
	)
	{
		spinner.init();
		option.init(
		{
			searchQuery: 'node',
			searchCount: 10
		});
		CORE = new core(
		{
			spinner,
			option
		});
		CORE.init(
		{
			consumer_key: process.env.TWITTER_API_KEY,
			consumer_secret: process.env.TWITTER_API_KEY_SECRET,
			access_token: process.env.TWITTER_ACCESS_TOKEN,
			access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
		});
	}
	else
	{
		process.exit(1);
	}
});

describe('core', () =>
{
	it('retweet', done =>
	{
		CORE.verify().then(() =>
		{
			CORE.process('retweet')
				.then(() => done())
				.catch(error => done(error));
		});
	});

	it('favorite', done =>
	{
		CORE.verify().then(() =>
		{
			CORE.process('favorite')
				.then(() => done())
				.catch(error => done(error));
		});
	});

	it('follow', done =>
	{
		CORE.verify().then(() =>
		{
			CORE.process('follow')
				.then(() => done())
				.catch(error => done(error));
		});
	});
});