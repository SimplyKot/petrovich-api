const CASEARRAY = [
  'nominative',
  'genitive',
  'dative',
  'accusative',
  'instrumental',
  'prepositional'
]

const NO_DATA_ERROR = '#НЕТДАННЫХ';
const NAME_ERROR = '#ОШИБКАФИО';
const NOT_CYRILLIC_ERROR = '#ОШИБКАРУС'
const CASE_WARNING = '[ПАДЕЖ?]';
const UNKNOWN_GENDER_WARNING = '[ПОЛ?]';


module.exports = { CASEARRAY, CASE_WARNING, NO_DATA_ERROR, UNKNOWN_GENDER_WARNING, NAME_ERROR, NOT_CYRILLIC_ERROR };