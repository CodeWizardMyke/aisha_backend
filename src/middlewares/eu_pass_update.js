const bcrypt = require('bcrypt');

const eu_pass_update = (req, res, next) => {
  const {password} = req.body;

  if(password) req.body.password =  bcrypt.hashSync(password, 10);

  return next();  
};

module.exports = eu_pass_update;