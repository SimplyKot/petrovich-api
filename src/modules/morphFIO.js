const Router = require('@koa/router');
// Подлкючаем библтотеку склонений
const petrovich = require('petrovich');


const router = new Router()


//TODO: Обратабыать ошибки:
// 1. Нет данных
// 2. ФИО состоит более чем из трех слов
// 3. ФИО состоит менее чем из трех слов
// 4. Пол не определяется (gender = androgynous)

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