const Koa = require('koa');
const config = require('config');
const path = require('path');
const fs = require('fs');
const twitterApi = require('./libs/twitter-api');

const app = new Koa();

/**
 * Add middleware
 */
const middlewares = fs.readdirSync(path.join(__dirname, 'middlewares')).sort();
middlewares.forEach(function(middleware) {
	app.use(require('./middlewares/' + middleware));
});

/**
 * Add router
 */
const Router = require('koa-router');
const router = new Router();

/**
 * Define routes
 */
router.get('/search/tweets/:search', async function(ctx) {

	if(!ctx.params.search) {
		ctx.response.body = 'Please provide search criteria for tweets';
		return;
	}

	/**
	 * Get tweets by search term
	 */
	let tweets = await twitterApi.searchTweets(ctx.params.search);
	twitterApi.changeTweetStream(ctx.params.search);
	ctx.response.body = tweets;
});

/**
 * Add routes
 */
app.use(router.routes());

/**
 * Create server
 */
const server = app.listen(config.get('port'));

/**
 * Create socket connection
 */
twitterApi.createTweetSocket(server);