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
	it('verify account', done =>
	{
		service
			.verifyAccount()
			.then(data =>
			{
				expect(data).to.have.property('userId');
				expect(data).to.have.property('userName');
				done();
			});
	});

	it('search-tweet', done =>
	{
		service.searchTweet(
		{
			query: 'test',
			count: 10
		})
		.then(data =>
		{
			if (data[0])
			{
				expect(data[0]).to.have.property('count');
				expect(data[0]).to.have.property('tweetId');
				expect(data[0]).to.have.property('tweetText');
				expect(data[0]).to.have.property('userId');
				expect(data[0]).to.have.property('userName');
			}
			done();
		});
	});

	it('search-user', done =>
	{
		service.searchUser(
		{
			query: 'test',
			count: 10
		})
		.then(data =>
		{
			if (data[0])
			{
				expect(data[0]).to.have.property('count');
				expect(data[0]).to.have.property('userId');
				expect(data[0]).to.have.property('userName');
			}
			done();
		});
	});

	it('list-follower', done =>
	{
		service.listFollower(
		{
			count: 10
		})
		.then(data =>
		{
			if (data[0])
			{
				expect(data[0]).to.have.property('count');
				expect(data[0]).to.have.property('userId');
				expect(data[0]).to.have.property('userName');
			}
			done();
		});
	});

	it('list-friend', done =>
	{
		service.listFriend(
		{
			count: 10
		})
		.then(data =>
		{
			if (data[0])
			{
				expect(data[0]).to.have.property('count');
				expect(data[0]).to.have.property('userId');
				expect(data[0]).to.have.property('userName');
			}
			done();
		});
	});

	it('list-tweet', done =>
	{
		service.listTweet(
		{
			count: 10
		})
		.then(data =>
		{
			if (data[0])
			{
				expect(data[0]).to.have.property('count');
				expect(data[0]).to.have.property('tweetId');
				expect(data[0]).to.have.property('tweetText');
			}
			done();
		});
	});

	it('list-like', done =>
	{
		service.listLike(
		{
			count: 10
		})
		.then(data =>
		{
			if (data[0])
			{
				expect(data[0]).to.have.property('count');
				expect(data[0]).to.have.property('tweetId');
				expect(data[0]).to.have.property('tweetText');
				expect(data[0]).to.have.property('userId');
				expect(data[0]).to.have.property('userName');
			}
			done();
		});
	});

	it('tweet', done =>
	{
		service.tweet(
		{
			tweetText: Date.now()
		},
		{
			undoRun: false
		})
		.then(data =>
		{
			expect(data).to.have.property('tweetId');
			expect(data).to.have.property('tweetText');
			expect(data).to.have.property('userId');
			expect(data).to.have.property('userName');
			done();
		});
	});

	it('(un)tweet', done =>
	{
		service.tweet(
		{
			tweetText: Date.now()
		},
		{
			undoRun: false
		})
		.then(data =>
		{
			service.tweet(
			{
				tweetId: data.tweetId
			},
			{
				undoRun: true
			})
			.then(data =>
			{
				expect(data).to.have.property('tweetId');
				expect(data).to.have.property('tweetText');
				expect(data).to.have.property('userId');
				expect(data).to.have.property('userName');
				done();
			});
		});
	});

	it('retweet', done =>
	{
		service.tweet(
		{
			tweetText: Date.now()
		},
		{
			undoRun: false
		})
		.then(data =>
		{
			service.retweet(
			{
				tweetId: data.tweetId
			},
			{
				undoRun: false
			})
			.then(data =>
			{
				expect(data).to.have.property('tweetId');
				expect(data).to.have.property('tweetText');
				expect(data).to.have.property('userId');
				expect(data).to.have.property('userName');
				done();
			});
		});
	});

	it('(un)retweet', done =>
	{
		service.tweet(
		{
			tweetText: Date.now()
		},
		{
			undoRun: false
		})
		.then(data =>
		{
			service.retweet(
			{
				tweetId: data.tweetId
			},
			{
				undoRun: false
			})
			.then(data =>
			{
				service.retweet(
				{
					tweetId: data.tweetId
				},
				{
					undoRun: true
				})
				.then(data =>
				{
					expect(data).to.have.property('tweetId');
					expect(data).to.have.property('tweetText');
					expect(data).to.have.property('userId');
					expect(data).to.have.property('userName');
					done();
				});
			});
		});
	});

	it('like', done =>
	{
		service.tweet(
		{
			tweetText: Date.now()
		},
		{
			undoRun: false
		})
		.then(data =>
		{
			service.like(
			{
				tweetId: data.tweetId
			},
			{
				undoRun: false
			})
			.then(data =>
			{
				expect(data).to.have.property('tweetId');
				expect(data).to.have.property('tweetText');
				expect(data).to.have.property('userId');
				expect(data).to.have.property('userName');
				done();
			});
		});
	});

	it('(un)like', done =>
	{
		service.tweet(
		{
			tweetText: Date.now()
		},
		{
			undoRun: false
		})
		.then(data =>
		{
			service.like(
			{
				tweetId: data.tweetId
			},
			{
				undoRun: false
			})
			.then(data =>
			{
				service.like(
				{
					tweetId: data.tweetId
				},
				{
					undoRun: true
				})
				.then(data =>
				{
					expect(data).to.have.property('tweetId');
					expect(data).to.have.property('tweetText');
					expect(data).to.have.property('userId');
					expect(data).to.have.property('userName');
					done();
				});
			});
		});
	});

	it('follow', done =>
	{
		service.follow(
		{
			userId: 59739125
		},
		{
			undoRun: false
		})
		.then(data =>
		{
			expect(data).to.have.property('userId');
			expect(data).to.have.property('userName');
			done();
		});
	});

	it('(un)follow', done =>
	{
		service.follow(
		{
			userId: 59739125
		},
		{
			undoRun: true
		})
		.then(data =>
		{
			expect(data).to.have.property('userId');
			expect(data).to.have.property('userName');
			done();
		});
	});
});