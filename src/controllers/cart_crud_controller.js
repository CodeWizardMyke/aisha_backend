const {Cart, Cart_item, Product} = require('../database/models');
const paginateDefine = require('../functions/paginateDefine');

const Cart_crud_controller = {
  create: async (req, res) => {
    try {
      const createCart = {
        amout:0,
        qtd_product:0,
        state:'pendding',
        fk_client: req.body.client_id
      }

      const {items} = req.body;


      for( const item of items ){
        const product = await Product.findByPk(item.product_id);
        qtd_products += item.qtd_product ;
        amout += Number(product.price) * item.qtd_product;
      }


      await Cart.create()

      

    } catch (error) {
      console.log(error);
      return res.status(401).json(error)  
    }
  },
  read:  async (req, res) => {
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
  update: async (req, res) => {
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
  delete: async (req, res) => {
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