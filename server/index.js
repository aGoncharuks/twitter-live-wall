const Koa = require('koa');
const app = new Koa();
const config = require('config');
const path = require('path');
const fs = require('fs');

/**
 * Add middlware
 */
const handlers = fs.readdirSync(path.join(__dirname, 'handlers')).sort();
handlers.forEach(handler => {
  const h = require('./handlers/' + handler);
  h.init(app);
});

/**
 * Add router
 */
const Router = require('koa-router');
const router = new Router();

/**
 * Define routes
 */
router.get('/', async function(ctx) {
	ctx.body = 'Server works';
});

/**
 * Add routes and start listening to port
 */
app.use(router.routes());
app.listen(config.get('port'));
