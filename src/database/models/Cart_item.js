
module.exports = (Sequelize,DateTypes) => {
    const Cart_item = Sequelize.define('Cart_item',{
        cart_item_id:{
            type:DateTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        fk_cart_id:DateTypes.INTEGER,
        fk_product_id:DateTypes.INTEGER,
        qtd_products:DateTypes.INTEGER
    },
    {
        tableName:'cart_item',
        timestamps:false
    });

    Cart_item.associate = (models) => {
        Cart_item.belongsTo(models.Cart,{
            foreignKey:'fk_cart_id',
            as:'cart'
        })
        
        Cart_item.belongsTo(models.Product,{
            foreignKey:'fk_product_id',
            as:'product'
        })
    }

    return Cart_item;
}