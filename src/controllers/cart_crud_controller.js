const {Cart, Cart_item, Product} = require('../database/models');
const paginateDefine = require('../functions/paginateDefine');

const Cart_crud_controller = {
  create: async (req, res) => {
    try {
      //creating base structure of the cart
      const objectCart = {
        amount:0,
        qtd_products:0,
        state:'pendding',
        fk_client_id: req.body.client_id
      }

      //extracting the items in the cart from the front end
      const {items} = req.body;

      //scrolling through all items in the cart
      for( const item of items ){
        //search for the product in the cart and update the stock by separating the items that will be sold
        const product = await Product.findByPk(item.product_id);
        await product.update({stock: product.stock - item.qtd_products});

        //update objectCart structure data
        objectCart.qtd_products += item.qtd_products ;
        objectCart.amount += Number(product.price) * item.qtd_products;
      }

      const dataCartCreated = await Cart.create(objectCart)

      for( const item of items){
        //Now add all the products listed by the user to the cart_item table
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
      let {client_id,state} = req.headers;

      const data = await Cart.findAndCountAll({
        where:{
          fk_client_id:client_id,
          state: state ? state : 'pendding' 
        },
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
      
      //search for cart based on id
      const cartData = await Cart.findOne({
        where:{
          cart_id: cart_id,
          state: 'pendding'
        }
      });

      //If nothing is found then return a message
      if(!cartData){
        return res.status(401).json({
          message: 'Carrinho inesistente ou com pagamento já aprovado!'
        });
      }

      //We search for all the items that were separated in the cart
      const cartItemData = await Cart_item.findAll({
        where:{
          fk_cart_id:cart_id
        }
      });

      //We iterate over all items found
      for(const item of cartItemData){
        //bring the product with the ID corresponding to the one in the cart
        const product =  await Product.findOne({
          where:{
            product_id: item.fk_product_id
          }
        })

        //update the product by adding back the separated items
        await product.update({
          stock: product.stock + item.qtd_products,
        })
        //finally delete the item from the cart
        await item.destroy();
      }
      //delete own cart
      await cartData.destroy();

      return res.json(`successfully deleted`);
    } catch (error) {
      console.log(error);
      return res.status(401).json(error)  
    } 
  }
};

module.exports = Cart_crud_controller;