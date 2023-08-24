module.exports = {
  saltRounds: Math.floor(Math.random() * 10),
  jwtSecretSalt: [...Array(9)].map(() => Math.random().toString(36)[2]).join(''),
  jwtSecretRefreshSalt: [...Array(9)].map(() => Math.random().toString(36)[2]).join(''),
  tokenLife: 5 * 60,
  refreshTokenLife: 3 * 60 * 60,
  MONGO_USER: 'atsjsc',
  MONGO_PASS: 'atsjsc',
  // DB_String: 'mongodb://192.169.254.11:27018/cloud_modem',
  DB_String: 'mongodb://cloud_database:27017/cloud_modem',
};
