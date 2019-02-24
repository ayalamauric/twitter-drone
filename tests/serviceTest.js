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
		service
			.verify()
			.then(data =>
			{
				expect(data).to.have.property('userId');
				expect(data).to.have.property('userName');
				done();
			});
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
			expect(data[0]).to.have.property('count');
			expect(data[0]).to.have.property('tweetId');
			expect(data[0]).to.have.property('tweetText');
			expect(data[0]).to.have.property('userId');
			expect(data[0]).to.have.property('userName');
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
			expect(data[0]).to.have.property('count');
			expect(data[0]).to.have.property('userId');
			expect(data[0]).to.have.property('userName');
			expect(data).to.have.length(1);
			done();
		});
	})
	.timeout(5000);

	it('list-follower', done =>
	{
		service.listFollower(
		{
			count: 1
		})
		.then(data =>
		{
			expect(data[0]).to.have.property('count');
			expect(data[0]).to.have.property('userId');
			expect(data[0]).to.have.property('userName');
			expect(data).to.have.length(1);
			done();
		});
	})
	.timeout(5000);

	it('list-friend', done =>
	{
		service.listFriend(
		{
			count: 1
		})
		.then(data =>
		{
			expect(data[0]).to.have.property('count');
			expect(data[0]).to.have.property('userId');
			expect(data[0]).to.have.property('userName');
			expect(data).to.have.length(1);
			done();
		});
	})
	.timeout(5000);

	it('list-tweet', done =>
	{
		service.listTweet(
		{
			count: 1
		})
		.then(data =>
		{
			expect(data[0]).to.have.property('count');
			expect(data[0]).to.have.property('tweetId');
			expect(data[0]).to.have.property('tweetText');
			expect(data).to.have.length(1);
			done();
		});
	})
	.timeout(5000);

	it('list-like', done =>
	{
		service.listLike(
		{
			count: 1
		})
		.then(data =>
		{
			expect(data[0]).to.have.property('count');
			expect(data[0]).to.have.property('tweetId');
			expect(data[0]).to.have.property('tweetText');
			expect(data[0]).to.have.property('userId');
			expect(data[0]).to.have.property('userName');
			expect(data).to.have.length(1);
			done();
		});
	})
	.timeout(5000);
});