const socketIO = require('socket.io');
const twitter = require('twitter');
const config = require('config');
const _ = require('lodash');

/**
 * Create twitter client
 * @type {Twitter}
 */
const twitterClient = new twitter({
	consumer_key: config.twitter.consumer_key,
	consumer_secret: config.twitter.consumer_secret,
	access_token_key: config.twitter.access_token_key,
	access_token_secret: config.twitter.access_token_secret
});

let tweetSocket;
let tweetStream;

/**
 * Search for 10 tweets matching search criteria
 * @param search
 * @returns {Promise}
 */
async function searchTweets(search) {
	return new Promise(async (resolve) => {
		twitterClient.get('search/tweets', {q: search, count: 10}, function(error, tweets) {
			resolve(tweets.statuses.map(tweet => {
				return {
					text: tweet.text,
					username: tweet.user && tweet.user.screen_name,
					avatar: tweet.user && tweet.user.profile_image_url_https
				}
			}));
		});
	});
}

/**
 * Create socket for client-server communication
 * Should emit tweet object when new tweet arrives
 * @param server
 */
function createTweetSocket(server) {
	const io = socketIO(server);
	io.on('connection', function (socket) {
		console.log('socket connected');
		tweetSocket = socket;

		socket.on('disconnect', () => {
			console.log('socket disconnected');
		});
	});
}

/**
 * Destroy old tweet stream(if exists) and create new one for new search criteria
 * !IMPORTANT! Destroy won't work because of npm twitter package bug, for more info see:
 * https://github.com/desmondmorris/node-twitter/issues/143
 * https://github.com/desmondmorris/node-twitter/issues/159
 * https://github.com/desmondmorris/node-twitter/issues/172
 * @param search
 */
function changeTweetStream(search) {
	if(tweetStream) {
		tweetStream.destroy();
	}
	tweetStream = twitterClient.stream('statuses/filter', {track: search});
	tweetStream.on('data', tweetStreamDataListener);
	tweetStream.on('error', tweetStreamErrorListener);
}

/**
 * Listener for status stream data event
 * Tweet is not the only event type that can arrive, for more info see: https://www.npmjs.com/package/twitter
 * In order to get tweets only stream data is filtered
 * @param event
 */
function tweetStreamDataListener(event) {
	if(isTweet(event)) {
		let tweet = {
			text: event.text,
			username: event.user && event.user.screen_name,
			avatar: event.user && event.user.profile_image_url_https
		};
		tweetSocket.emit('tweet', tweet);
	}
}

/**
 * 420 Error(rate limiting) will be in case of several consequent search requests, server should be restarted then
 * See comment fo changeTweetStream f-n for more details)
 */
function tweetStreamErrorListener(e) {
	if (e.message === 'Status Code: 420') {
		console.log('Stream closed because of rate limit => Restart');
	}
}

/**
 * Check if status matches tweet interface
 * @param event
 */
function isTweet(event) {
	return _.conformsTo(event, {
		user: _.isObject,
		id_str: _.isString,
		text: _.isString
	});
}

exports.searchTweets = searchTweets;
exports.createTweetSocket = createTweetSocket;
exports.changeTweetStream = changeTweetStream;