export default (): Record<string, any> => ({
  port: parseInt(process.env.PORT, 10) || 5000,
  bcryptSalt: parseInt(process.env.BCRYPT_SALT, 10) || 10,
  apiPrefix: process.env.API_PREFIX || 'v1',
});
