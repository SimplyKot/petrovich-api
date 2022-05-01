const Router = require('@koa/router');
// Подлкючаем библтотеку склонений
const petrovich = require('petrovich');


const router = new Router()

const caseArray = [
  'nominative',
  'genitive',
  'dative',
  'accusative',
  'instrumental',
  'prepositional'
]

function normalize(word) {
  return word[0].toUpperCase() + word.slice(1).toLowerCase()
}

//TODO: Обратабыать ошибки:
// [+] 0. Обработать случай когда все буквы заглавные
// 1. Нет данных
// 2. ФИО состоит более чем из трех слов
// 3. ФИО состоит менее чем из трех слов
// 4. Пол не определяется (gender = androgynous)
// 5. Падеж не число и не находится пределе [1-6]

// Тело дожно содержать два параметра ФИО (fio) и падеж (case_fio)
router.post('/', async ctx => {
  // Достаем параметры из тела
  const { fio, case_fio } = ctx.request.body;

  // Режем строку на массив по пробелам
  const fioArray = fio.split(' ');

  // Готовим объект для Petrovich
  const person = {
    first: fioArray[1],
    middle: fioArray[2],
    last: fioArray[0]
  }

  // Берем последнюю букву отчества для определения регистра
  const lastMiddleChar = person.middle[person.middle.length - 1];
  const isUpperCase = lastMiddleChar == lastMiddleChar.toUpperCase();

  // Если строчная - то нормализуем ФИО
  if (!isUpperCase) {
    person.first = normalize(person.first);
    person.middle = normalize(person.middle);
    person.last = normalize(person.last)
  }

  // Склоняем (если падеж не задан - используем винительный)
  const response = petrovich(person, caseArray[case_fio - 1] || 'genitive')
  const responseBody = isUpperCase ? (response.last + ' ' + response.first + ' ' + response.middle).toUpperCase() : (response.last + ' ' + response.first + ' ' + response.middle)

  // Логируем проведенною работу
  //console.log(`${fio}, [${case_fio}] -> ${response.first} ${response.middle} ${response.last}`.toUpperCase());

  // Возвращем обратно строку
  ctx.body = responseBody;
});

module.exports = router;