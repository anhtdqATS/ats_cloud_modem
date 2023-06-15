module.exports = {
  saltRounds: Math.floor(Math.random() * 10),
  jwtSecretSalt: [...Array(9)].map(() => Math.random().toString(36)[2]).join(''),
  jwtSecretRefreshSalt: [...Array(9)].map(() => Math.random().toString(36)[2]).join(''),
  tokenLife: 15 * 60,
  refreshTokenLife: 24 * 60 * 60,

  // testMongoUrl: 'mongodb://localhost/test',
};
