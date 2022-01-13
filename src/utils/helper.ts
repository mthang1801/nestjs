import DATE_FORMATER from 'date-format';

export const convertDateToTimeStamp = (DateTime) =>
  new Date(new Date(DateTime).getTime() + 7 * 3600 * 1000)
    .toISOString()
    .slice(0, 19)
    .replace('T', ' ');
