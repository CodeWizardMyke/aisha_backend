const {Employee} = require('../database/models');
const paginateDefine = require('../functions/paginateDefine');

const employee_crud_controller = {
  createEmployee: async (req, res) => {
    try {
      const data = await Employee.create(req.body)
      return res.json(data);
    } catch (error) {
      console.log(error);
      return res.status(401).json(error)  
    }
  },
  readEmployee:  async (req, res) => {
    try {
      const {page, size} = paginateDefine(req);
      
      const data = await Employee.findAndCountAll({
        limit: size,
        offset: size * (page - 1), 
      })
      return res.json(data);
    } catch (error) {
      console.log(error);
      return res.status(401).json(error)  
    }
  },
  updateEmployee: async (req, res) => {
    try {
      const {employee_id} = req.headers;
      const data = await Employee.findByPk(employee_id);
      await data.update(req.body);
      return res.json(data);
    } catch (error) {
      console.log(error);
      return res.status(401).json(error)  
    }
  },
  deleteEmployee: async (req, res) => {
    try {
      const {employee_id} = req.headers;
      const data = await Employee.findByPk(employee_id);
      await data.destroy();
      return res.json(`successfully deleted employee_id = ${data}`);
    } catch (error) {
      console.log(error);
      return res.status(401).json(error)  
    } 
  }
};

module.exports = employee_crud_controller;