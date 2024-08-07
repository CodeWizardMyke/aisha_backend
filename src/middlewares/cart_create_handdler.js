const {Product} = require('../database/models');

const cart_create_handdler = async (req, res, next) => {

    let amout_cart = 0;
    let items_qtd = 0;

    const {items} = req.body;

    for( const item of items ){
        const product = await Product.findByPk(item.product_id);

        items_qtd += item.qtd_product ;
        amout_cart += Number(product.price) * item.qtd_product ;

    }

    console.log(amout_cart)
    console.log(items_qtd)
    
    console.log(req.body)
}

module.exports = cart_create_handdler;
