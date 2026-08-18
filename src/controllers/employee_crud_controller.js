const {Employee} = require('../database/models');
const paginateDefine = require('../functions/paginateDefine');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const employee_crud_controller = {
  createEmployee: async (req, res) => {
    try {

      req.body.role = 'aux';
      
      const user = await Employee.create(req.body)

      const token = jwt.sign({ employee_id:user.employee_id }, process.env.JWT_TOKEN, /*{expiresIn:'0h'}*/ );;
      
      const authTimer = await new Date();

      return res.json({
        token,
        user,
        authTimer
      });

    } catch (error) {
      console.log(error);
      return res.status(500).json(error)  
    }
  },
  readEmployee:  async (req, res) => {
    try {
      const {page, size} = paginateDefine(req);
      
      let data = await Employee.findAndCountAll({
        limit: size,
        offset: size * (page - 1), 
      })

      data.rows.map( item => { item.password = undefined })

      return res.json(data);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error)  
    }
  },
  updateEmployee: async (req, res) => {
    try {
      let emp = req.employee;

      if(!emp){
        emp = await Employee.findByPk(req.token_decoded.employee_id);
      }
      
      req.body.email = "";
      delete req.body.email 
      
      req.body.role = "";
      delete req.body.role

      await emp.update(req.body);
      
      emp.password = ""
      delete emp.password;
      
      console.log(emp)

      return res.json(emp);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error)  
    }
  },
  deleteEmployee: async (req, res) => {
    try {
      const {employee_id} = req.token_decoded;

      const {password} = req.body;

      if(!password?.trim()){
        return res.status(401).json({errors:[{path:'password', msg:'credencial não fornecida!'}]})
      }

      const user = await Employee.findByPk(employee_id);

      const checkPass = await bcrypt.compare(password,user.password);
      
      if(!checkPass){
        return res.status(401).json({errors:[{path:'password', msg:'credencial incorreta!'}]})
      }

      await user.destroy();

      return res.status(200).json(true);

    } catch (error) {
      console.log(error);
      return res.status(500).json(error)  
    } 
  }
};

module.exports = employee_crud_controller;