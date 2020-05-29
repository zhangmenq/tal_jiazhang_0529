const config = {};
const env = process.env.NODE_ENV;

switch (env) {
  case 'mock':
    Object.assign(config, {
      host: '/api',
      client_secret: 'bkSNoyKcqvyIEyxo2PU8AEstMsvZC1i4KMpDxqsP',
      client_id: 1,
      grant_type: 'vipx',
      test_host: 'http://114.215.26.54:8115',
    });
    break;
  case 'development':
    Object.assign(config, {
      host: 'http://testing-api-vipx.lewaijiao.com/',
      // host: 'http://114.215.26.54:8302/',
      client_secret: 'D5R3pTQ9RvDHsdQwteIdbdak5ZGA1xDAQLVpfeun',
      client_id: 161201,
      grant_type: 'vipx',
      test_host: 'http://114.215.26.54:8115',
      oss_host: 'http://vipx-test.oss-cn-beijing.aliyuncs.com/',
    });
    break;
  case 'production':
    Object.assign(config, {
      host: 'http://testing-api-vipx.lewaijiao.com/',
      // host: 'http://114.215.26.54:8302/',
      client_secret: 'D5R3pTQ9RvDHsdQwteIdbdak5ZGA1xDAQLVpfeun',
      client_id: 161201,
      grant_type: 'vipx',
      test_host: 'http://114.215.26.54:8115',
      oss_host: 'http://vipx-test.oss-cn-beijing.aliyuncs.com/',
    });
    break;
  case 'deployment':
    Object.assign(config, {
      host: 'https://vipx-api.lewaijiao.com/',
      test_host: 'https://quiz.vipx.com',
      client_secret: 'D5R3pTQ9RvDHsdQwteIdbdak5ZGA1xDAQLVpfeun',
      client_id: 161201,
      grant_type: 'vipx',
      oss_host: 'http://vipx.oss-cn-beijing.aliyuncs.com/',
    });
    break;
  default:
    break;
}

export default config;
