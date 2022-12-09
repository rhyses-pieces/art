const dayjs = require('dayjs');

const defaultFormat = 'DD MMM YYYY';

function dayFilter(date, format = defaultFormat) {
  return dayjs(date).format(format);
}

module.exports = dayFilter;