const childProcess = require('child_process');

const host = {
  stg: { server: '192.168.100.25', port: 220 },
  stg1: { server: '192.168.100.25', port: 221 },
  stg2: { server: '192.168.100.10', port: 222 },
  stg3: { server: '192.168.100.10', port: 223 },
  stg4: { server: '192.168.100.7', port: 224 },
  stgb: { server: '192.168.100.11', port: 221 }
};

const UUID_REGEX = '[0-9a-fA-F]{8}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{12}';

module.exports = (configName) => {
  const config = host[configName];
  console.log('config: ', config);
  if (config === undefined) {
    throw new Error('Invalid config passed for fetching key');
  }

  const key = childProcess.execSync(`ssh -p ${config.port} root@${config.server} '/data/redis/install/redis-cli get DEVELOPER_KEY_VALUE'`).toString().trim();
  if (typeof key !== 'string') {
    throw new Error('Could not fetch a valid key');
  }
  if (!key.match(UUID_REGEX)) {
    throw new Error('Could not fetch a valid key');
  }
  return key;
};
