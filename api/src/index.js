require('dotenv').config({ path: process.env.DOTENV_CONFIG_PATH, override: true });

const setupModels = require('./shared/setupModels');
const { isTestingEnv } = require('./shared/helpers');

const Koa = require('koa');
const logger = require('koa-logger');
const json = require('koa-json');
const bodyParser = require('koa-bodyparser');

const router = require('./router');

const app = new Koa();

// middlewares
app.use(json());

if (!isTestingEnv()) {
  app.use(logger());
}

app.use(bodyParser());

// routes
app.use(router.routes());
app.use(router.allowedMethods());

setupModels();

// initiliase app
const PORT = parseInt(process.env.PORT || 3000);
module.exports = app.listen(PORT, () => {
  if (!isTestingEnv()) console.log(`initialize application to port ${PORT}`);
});