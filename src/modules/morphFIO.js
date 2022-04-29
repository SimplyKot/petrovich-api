const Router = require('@koa/router');
// Подлкючаем библтотеку склонений
const petrovich = require('petrovich');


const router = new Router()


// Тело дожно содержать два параметра ФИО (fio) и падеж (case_fio)
router.post('/', async ctx => {
  // Достаем параметры из тела
  const { fio, case_fio } = ctx.request.body;
  // Режем строку на массив по пробелам
  const fioArray = fio.split(' ');
  // Готовим объект для Petrovich
  const person = {
    first: fioArray[0],
    middle: fioArray[1],
    last: fioArray[2]
  }
  // Склоняем
  const response = petrovich(person, case_fio || 'accusative')
  // Возвращем обратно строку
  ctx.body = response.first + ' ' + response.middle + ' ' + response.last;
});

module.exports = router;