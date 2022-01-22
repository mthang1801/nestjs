export default (): Record<string, any> => ({
  port: parseInt(process.env.PORT, 10) || 5000,
  bcryptSalt: parseInt(process.env.BCRYPT_SALT, 10) || 10,
  apiBEPrefix: process.env.API_BE_PREFIX || '/be/v1',
  apiFEPrefix: process.env.API_FE_PREFIX || '/fe/v1',
  whiteListCORS: [
    'http://localhost:3000',
    'https://ddvdev.ntlogistics.vn/',
    'https://ddvcmsdev.ntlogistics.vn/',
    'http://localhost:5000',
  ],
});
