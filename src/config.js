module.exports = {
  saltRounds: Math.floor(Math.random() * 10),
  jwtSecretSalt: [...Array(9)].map(() => Math.random().toString(36)[2]).join(''),
  jwtSecretRefreshSalt: [...Array(9)].map(() => Math.random().toString(36)[2]).join(''),
  tokenLife: 5 * 60,
  refreshTokenLife: 3 * 60 * 60,

  // testMongoUrl: 'mongodb://localhost/test',
};
