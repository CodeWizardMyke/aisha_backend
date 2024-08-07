const {Cart, Cart_item, Product} = require('../database/models');
const paginateDefine = require('../functions/paginateDefine');

const Cart_crud_controller = {
  create: async (req, res) => {
    try {
      const objectCart = {
        amount:0,
        qtd_products:0,
        state:'pendding',
        fk_client_id: req.body.client_id
      }

      const {items} = req.body;

      for( const item of items ){
        const product = await Product.findByPk(item.product_id);
        objectCart.qtd_products += item.qtd_products ;
        objectCart.amount += Number(product.price) * item.qtd_products;
      }

      const dataCartCreated = await Cart.create(objectCart)

      for( const item of items){
        await Cart_item.create({
          fk_cart_id:    dataCartCreated.cart_id,
          fk_product_id: item.product_id,
          qtd_products:  item.qtd_products
        })
      }

      return res.status(201).json('Criado com sucesso!')

    } catch (error) {
      console.log(error);
      return res.status(401).json(error)  
    }
  },
  read:  async (req, res) => {
    try {
      const {page, size} = paginateDefine(req);
      const {client_id} = req.headers;
      
      const data = await Cart.findAndCountAll({
        where:{fk_client_id:client_id},
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
          state: 'pendding'
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