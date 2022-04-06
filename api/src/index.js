const Koa = require('koa');
const logger = require('koa-logger');
const json = require('koa-json');
const boadyParser = require('koa-bodyparser');

const router = require('./router');

const app = new Koa();

// middlewares
app.use(json());
app.use(logger());
app.use(boadyParser());

// routes
app.use(router.routes());
app.use(router.allowedMethods());

// initiliase app
const PORT = parseInt(process.env.PORT || 3000);
app.listen(PORT, () => {
  console.log(`initialize application to port ${PORT}`);
});