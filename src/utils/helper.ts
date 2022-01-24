export const convertToMySQLDateTime = (DateTime = new Date()) =>
  new Date(new Date(DateTime).getTime() + 7 * 3600 * 1000)
    .toISOString()
    .slice(0, 19)
    .replace('T', ' ');

export const preprocessUserResult = (user) => {
  let userObject = { ...user };
  delete userObject.password;
  delete userObject.salt;
  return userObject;
};

export const generateOTPDigits = () =>
  Math.floor(100000 + Math.random() * 900000);

export const preprocessDatabaseBeforeResponse = (data) => {
  let dataObject = { ...data };
  if (dataObject['created_at']) {
    dataObject['created_at'] = convertToMySQLDateTime(dataObject['created_at']);
  }
  if (dataObject['updated_at']) {
    dataObject['updated_at'] = convertToMySQLDateTime(dataObject['updated_at']);
  }
  return dataObject;
};
