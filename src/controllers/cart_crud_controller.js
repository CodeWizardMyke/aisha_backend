const {Cart} = require('../database/models');
const paginateDefine = require('../functions/paginateDefine');

const Cart_crud_controller = {
  createCart: async (req, res) => {
    try {
      const data = await Cart.create(req.body)
      return res.json(data);
    } catch (error) {
      console.log(error);
      return res.status(401).json(error)  
    }
  },
  readCart:  async (req, res) => {
    try {
      const {page, size} = paginateDefine(req);
      const {cpf, state} = req.headers;
      
      const data = await Cart.findAndCountAll({
        where:{ cpf: cpf, state: state },
        limit: size,
        offset: size * (page - 1), 
      })
      return res.json(data);
    } catch (error) {
      console.log(error);
      return res.status(401).json(error)  
    }
  },
  updateCart: async (req, res) => {
    try {
      const {cart_id} = req.headers;
      const data = await Cart.findByPk(cart_id);
      await data.update(req.body);
      return res.json(data);
    } catch (error) {
      console.log(error);
      return res.status(401).json(error)  
    }
  },
  deleteCart: async (req, res) => {
    try {
      const {cart_id} = req.headers;
      
      const data = await Cart.findOne({
        where:{
          cart_id: cart_id,
          state: 'approved'
        }
      });
      
      if(!data){
        return res.status(401).json({
          message: 'Carrinho inesistente ou com pagamento já aprovado!'
        });
      }

      await data.destroy();
      return res.json(`successfully deleted Cart_id = ${data}`);
    } catch (error) {
      console.log(error);
      return res.status(401).json(error)  
    } 
  }
};

module.exports = Cart_crud_controller;