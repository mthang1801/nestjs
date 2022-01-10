import DATE_FORMATER from 'date-format';

export const convertDateToTimeStamp = (DateTime) =>
  new Date(DateTime).toISOString().slice(0, 19).replace('T', ' ');
