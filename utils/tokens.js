module.exports.generate = (size = 10) => {
  let token = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < size; i += 1) {
    token += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return token;
};
