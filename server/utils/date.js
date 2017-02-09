const moment = require('moment-timezone');
// const ISORegex = /^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/;

exports.format = (date, timezone) => {
  let _date = moment(date);
  if (timezone) {
    _date = _date.tz(timezone);
  }
  return _date.format('DD/MM/YYYY');
};
exports.currentYear = () => (new Date()).getFullYear();
exports.startOfYear = (year, timezone) => moment(`${year}/06/06`, 'YYYY/MM/DD').tz(timezone).startOf('year').toDate();
exports.endOfYear = (year, timezone) => moment(`${year}/06/06`, 'YYYY/MM/DD').tz(timezone).endOf('year').toDate();
