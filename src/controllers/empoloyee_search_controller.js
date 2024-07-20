const {Employee} = require('../database/models');

const { Op } = require('sequelize');
const  paginateDefine = require('../functions/paginateDefine');

const empoloyee_search_controller = {
  getById: async (req, res) => {
    try {
      let {employee_id} = req.headers;
      
      if(!employee_id) employee_id = req.decoded.employee_id;

      const data = await Employee.findByPk(employee_id);
      return res.json(data);

    } catch (error) {
      return res.status(500).json(error);      
    }

  },
  getByName: async (req, res) => {
    try {
      const {size, page} = paginateDefine(req);
      
      const {name} = req.headers;
      if(!name) return res.status(401).json({error:{path:'title',msg:'Informe o nome do funcionário!'}});

      const data = await Employee.findAndCountAll({
        where:{ name:{[Op.like]: `%${name}%`} },
        limit: size,
        offset: size * (page - 1),
      })
      return res.json(data);

    } catch (error) {
      return res.status(500).json(error);      
    };
  },
  getByEmail: async (req, res) => {
    try {
      const {size, page} = paginateDefine(req);
      
      const {email} = req.headers;
      console.log(req.headers)
      if(!email) return res.status(401).json({error:{path:'email',msg:'Informe o email do funcionário!'}});

      const data = await Employee.findAndCountAll({
        where:{ email:{[Op.like]: `${email}%`} },
        limit: size,
        offset: size * (page - 1),
      })
      return res.json(data);

    } catch (error) {
      return res.status(500).json(error);      
    };    
  },
}

module.exports = empoloyee_search_controller;
