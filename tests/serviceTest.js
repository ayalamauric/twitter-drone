const expect = require('chai').expect;
const drone = require('../');
const service = drone.service;
const dotenv = require('dotenv');

beforeEach(() =>
{
	dotenv.config();
	service.init(
	{
		consumer_key: process.env.TWITTER_API_KEY,
		consumer_secret: process.env.TWITTER_API_KEY_SECRET,
		access_token: process.env.TWITTER_ACCESS_TOKEN,
		access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
	});
});

describe('service', () =>
{
	it('verify', done =>
	{
		service.verify().then(() => done());
	})
	.timeout(5000);

	it('search-tweet', done =>
	{
		service.searchTweet(
		{
			query: 'test',
			count: 1
		})
		.then(data =>
		{
			expect(data).to.not.have.property('count');
			expect(data).to.not.have.property('tweetId');
			expect(data).to.not.have.property('tweetText');
			expect(data).to.not.have.property('userId');
			expect(data).to.not.have.property('userName');
			expect(data).to.have.length(1);
			done();
		});
	})
	.timeout(5000);

	it('search-user', done =>
	{
		service.searchUser(
		{
			query: 'test',
			count: 1
		})
		.then(data =>
		{
			expect(data).to.not.have.property('count');
			expect(data).to.not.have.property('userId');
			expect(data).to.not.have.property('userName');
			expect(data).to.have.length(1);
			done();
		});
	})
	.timeout(5000);
});