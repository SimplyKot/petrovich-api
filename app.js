require('dotenv').config();
const Koa = require('koa');
const Router = require('@koa/router');
const bodyParser = require('koa-bodyparser');
const cors = require('koa-cors');

// Подключаем модуль красивого отображения времени
const prettyMilliseconds = require('pretty-ms');
// Подключаем модуль спряжения имен
const morphFIO = require('./src/modules/morphFIO');

// Если указан PORT в окружкнии, то задаем его. Если не указан - то используем 3000
const PORT = process.env.PORT || 3000;

// Фиксируем время запуска сервера
const startTime = Date.now();

const app = new Koa();
const router = new Router();
app.use(bodyParser());

// Обработчик GET для корневого маршрута
router.get('/', (ctx) => {
  ctx.body = `Uptime: ${prettyMilliseconds((Date.now() - startTime))}`;
});

// Остальные методы обрабатываются в модуле morphFIO
router.use('/', morphFIO.routes())

// response
app.use(cors());
app.use(router.allowedMethods());
app.use(router.routes())

// eslint-disable-next-line no-console
app.listen(PORT, () => console.log(`Service Petrovich started on port: ${PORT}`));