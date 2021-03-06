const Router = require('@koa/router');
// Подлкючаем библиотеку склонений
const petrovich = require('petrovich');
// Подлкючаем константы
const { CASEARRAY, CASE_WARNING, NO_DATA_ERROR, UNKNOWN_GENDER_WARNING, NAME_ERROR, NOT_CYRILLIC_ERROR } = require('../../utils/constants');

const router = new Router()

// Функция делает первую букву слоыв заглавной, а остальные строчными
function normalize(word) {
  return word[0].toUpperCase() + word.slice(1).toLowerCase()
}

// Тело дожно содержать два параметра ФИО (fio) и падеж (caseFio)
router.post('/', async ctx => {
  let warning = '';
  // Достаем параметры из тела
  const { fio } = ctx.request.body;
  const caseFio = ctx.request.body.case_fio;

  // Если данных в fio нет - возвращаем ошибку с описанием
  if (!fio) { ctx.body = NO_DATA_ERROR; return }

  // Если в fio есть не кириллические сивмолы - возвращаем ошибку
  if ((/[^\s-а-яА-ЯёЁ]+/ig).test(fio)) { ctx.body = NOT_CYRILLIC_ERROR; return }

  // Если есть case_fio, то он дожен юыть от 1 до 6
  if (caseFio && (caseFio < 1 || caseFio > 6)) { warning = `${warning} ${CASE_WARNING}` }

  // Режем строку на массив по пробелам
  const fioArray = fio.trim().split(' ');

  // Если не хватает одного элементв ФИО - возвращаем ошибку с описанием
  if (fioArray.length !== 3) { ctx.body = NAME_ERROR; return }

  // Готовим объект для Petrovich
  const person = {
    first: fioArray[1],
    middle: fioArray[2],
    last: fioArray[0]
  }

  // Берем последнюю букву отчества для определения регистра
  const lastMiddleChar = person.middle[person.middle.length - 1];
  const isUpperCase = lastMiddleChar === lastMiddleChar.toUpperCase();

  // Если строчная - то нормализуем ФИО
  if (!isUpperCase) {
    person.middle = normalize(person.middle);
    person.middle = normalize(person.middle);
    // Если фамилия составная - разбываем ее и нормализуем каждое слово по отельности 
    person.last = person.last.split('-').map(el => normalize(el)).join('-')
  }

  // Склоняем (если падеж не задан - используем винительный)
  const response = petrovich(person, CASEARRAY[caseFio - 1] || 'genitive')

  // Если пол неясен - добавляем предупреждение
  if (response.gender === 'androgynous') { warning = `${warning} ${UNKNOWN_GENDER_WARNING}` }

  const responseBody = isUpperCase ? (`${response.last} ${response.first} ${response.middle}`).toUpperCase() : (`${response.last} ${response.first} ${response.middle}`)

  // Логируем проведенною работу
  // console.log(`${fio}, [${caseFio}] -> ${response.first} ${response.middle} ${response.last}`.toUpperCase());

  // Возвращем обратно строку
  ctx.body = responseBody + warning;
});

module.exports = router;