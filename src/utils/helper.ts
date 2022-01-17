export const convertToMySQLDateTime = (DateTime = new Date()) =>
  new Date(new Date(DateTime).getTime() + 7 * 3600 * 1000)
    .toISOString()
    .slice(0, 19)
    .replace('T', ' ');
