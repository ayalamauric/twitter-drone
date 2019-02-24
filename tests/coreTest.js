const expect = require('chai').expect;
const exec = require('child_process').exec;
const dotenv = require('dotenv');

beforeEach(() =>
{
	dotenv.config();
});

describe('core', () =>
{
	it('search-tweet', done =>
	{
		exec('bin/twitter-drone search tweet --query=test', (error, stdout) =>
		{
			expect(stdout).to.match(/test/);
			done();
		});
	})
	.timeout(5000);

	it('search-user', done =>
	{
		exec('bin/twitter-drone search user --query=test', (error, stdout) =>
		{
			expect(stdout).to.match(/userId/);
			expect(stdout).to.match(/userName/);
			done();
		});
	})
	.timeout(5000);

	it('list-follower', done =>
	{
		exec('bin/twitter-drone list follower', (error, stdout) =>
		{
			expect(stdout).to.match(/userId/);
			expect(stdout).to.match(/userName/);
			done();
		});
	})
	.timeout(5000);

	it('list-friend', done =>
	{
		exec('bin/twitter-drone list friend', (error, stdout) =>
		{
			expect(stdout).to.match(/userId/);
			expect(stdout).to.match(/userName/);
			done();
		});
	})
	.timeout(5000);

	it('list-tweet', done =>
	{
		exec('bin/twitter-drone list tweet', (error, stdout) =>
		{
			expect(stdout).to.match(/tweetId/);
			expect(stdout).to.match(/tweetText/);
			done();
		});
	})
	.timeout(5000);

	it('list-like', done =>
	{
		exec('bin/twitter-drone list like', (error, stdout) =>
		{
			expect(stdout).to.match(/tweetId/);
			expect(stdout).to.match(/tweetText/);
			done();
		});
	})
	.timeout(5000);


	it('tweet', done =>
	{
		exec('bin/twitter-drone search tweet --query=test | bin/twitter-drone tweet --dry-run', (error, stdout, stderr) =>
		{
			expect(stderr).to.have.length;
			done();
		});
	})
	.timeout(5000);

	it('retweet', done =>
	{
		exec('bin/twitter-drone search tweet --query=test | bin/twitter-drone retweet --dry-run', (error, stdout, stderr) =>
		{
			expect(stderr).to.have.length;
			done();
		});
	})
	.timeout(5000);

	it('like', done =>
	{
		exec('bin/twitter-drone search tweet --query=test | bin/twitter-drone like --dry-run', (error, stdout, stderr) =>
		{
			expect(stderr).to.have.length;
			done();
		});
	})
	.timeout(5000);

	it('follow', done =>
	{
		exec('bin/twitter-drone search tweet --query=test | bin/twitter-drone follow --dry-run', (error, stdout, stderr) =>
		{
			expect(stderr).to.have.length;
			done();
		});
	})
	.timeout(5000);
});