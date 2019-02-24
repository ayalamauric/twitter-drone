const expect = require('chai').expect;
const exec = require('child_process').exec;
const drone = require('../');
const stream = drone.stream;
const dotenv = require('dotenv');

beforeEach(() =>
{
	stream.init();
	dotenv.config();
});

describe('core', () =>
{
	it('search-tweet', done =>
	{
		exec('bin/twitter-drone search tweet --query=test', (error, stdout) =>
		{
			const dataArray = stream.parse(stdout);

			expect(dataArray[0]).to.have.property('count');
			expect(dataArray[0]).to.have.property('tweetId');
			expect(dataArray[0]).to.have.property('tweetText');
			expect(dataArray[0]).to.have.property('userId');
			expect(dataArray[0]).to.have.property('userName');
			done();
		});
	});

	it('search-user', done =>
	{
		exec('bin/twitter-drone search user --query=test', (error, stdout) =>
		{
			const dataArray = stream.parse(stdout);

			expect(dataArray[0]).to.have.property('count');
			expect(dataArray[0]).to.have.property('userId');
			expect(dataArray[0]).to.have.property('userName');
			done();
		});
	});

	it('list-follower', done =>
	{
		exec('bin/twitter-drone list follower', (error, stdout) =>
		{
			const dataArray = stream.parse(stdout);

			expect(dataArray[0]).to.have.property('count');
			expect(dataArray[0]).to.have.property('userId');
			expect(dataArray[0]).to.have.property('userName');
			done();
		});
	});

	it('list-friend', done =>
	{
		exec('bin/twitter-drone list friend', (error, stdout) =>
		{
			const dataArray = stream.parse(stdout);

			expect(dataArray[0]).to.have.property('count');
			expect(dataArray[0]).to.have.property('userId');
			expect(dataArray[0]).to.have.property('userName');
			done();
		});
	});

	it('list-tweet', done =>
	{
		exec('bin/twitter-drone list tweet', (error, stdout) =>
		{
			const dataArray = stream.parse(stdout);

			expect(dataArray[0]).to.have.property('count');
			expect(dataArray[0]).to.have.property('tweetId');
			expect(dataArray[0]).to.have.property('tweetText');
			expect(dataArray[0]).to.have.property('userId');
			expect(dataArray[0]).to.have.property('userName');
			done();
		});
	});

	it('list-like', done =>
	{
		exec('bin/twitter-drone list like', (error, stdout) =>
		{
			const dataArray = stream.parse(stdout);

			expect(dataArray[0]).to.have.property('count');
			expect(dataArray[0]).to.have.property('tweetId');
			expect(dataArray[0]).to.have.property('tweetText');
			expect(dataArray[0]).to.have.property('userId');
			expect(dataArray[0]).to.have.property('userName');
			done();
		});
	});

	it.skip('tweet', done =>
	{
		exec('bin/twitter-drone search tweet --query=test | bin/twitter-drone tweet --dry-run', (error, stdout, stderr) =>
		{
			expect(stderr).to.have.length;
			done();
		});
	});

	it.skip('retweet', done =>
	{
		exec('bin/twitter-drone search tweet --query=test | bin/twitter-drone retweet --dry-run', (error, stdout, stderr) =>
		{
			expect(stderr).to.have.length;
			done();
		});
	});

	it.skip('like', done =>
	{
		exec('bin/twitter-drone search tweet --query=test | bin/twitter-drone like --dry-run', (error, stdout, stderr) =>
		{
			expect(stderr).to.have.length;
			done();
		});
	});

	it.skip('follow', done =>
	{
		exec('bin/twitter-drone search tweet --query=test | bin/twitter-drone follow --dry-run', (error, stdout, stderr) =>
		{
			expect(stderr).to.have.length;
			done();
		});
	});
});