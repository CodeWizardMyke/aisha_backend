const {Employee} = require('../database/models');
const bcrypt = require('bcrypt');

const eu_pass_update = async (req, res, next) => {
  const {password, re_password,currentPassword } = req.body;
  const {employee_id} = req.token_decoded;

  if(password){
    if(!currentPassword){
      return res.status(400).json({errors:[{path:'currentPassword',msg:"Senha atual não foi informada!!"}]})
    }

    if(!re_password){
      return res.status(400).json({errors:[{path:'re_password',msg:"Digite novamente sua senha!"}]})
    }

    if(password.trim() !== re_password.trim() ){
      return res.status(400).json({errors:[{path:'re_password',msg:"As devem ser iguais!"}]})
    }
  
    try {
      const data = await Employee.findByPk(employee_id);

      const matchPass = await bcrypt.compare(currentPassword, data.password);
      const passwordSamePrevious = await bcrypt.compare(password, data.password);

      if(!matchPass){
        return res.status(400).json({errors:[{path:'currentPassword',msg:"Sua senha atual está incorreta"}]})
      }
      
      if(passwordSamePrevious){
        return res.status(400).json({errors:[{path:'password',msg:"Senha anterior é idêntica à senha inserida. Por favor, forneça uma senha diferente."}]})
      }
      
      req.body.password = bcrypt.hashSync(password, 10);

      req.employee = data;

    } catch (error) {
      return res.status(403).json(error)
    }
    
  };
  
  return next();
};

module.exports = eu_pass_update;