export default (): Record<string, any> => ({
  cache_host: process.env.CACHE_HOST,
  cache_port: process.env.CACHE_PORT,
  cache_ttl: +process.env.CACHE_TTL,
});
