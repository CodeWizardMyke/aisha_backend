
module.exports =  (sequelize, Datetypes) => {
  const Cart = sequelize.define('Cart',{
    Cart_id:{
      type:Datetypes.INTEGER,
      autoIncrement:true,
      primaryKey:true,
      allowNull:false,
      unique:true
    },
    user_name:{
      type:Datetypes.STRING,
      allowNull:false
    },
    product_id:{
      type: Datetypes.INTEGER,
      allowNull:false
    },
    qtd_product:{
      type:Datetypes.STRING,
      allowNull:false,
    },
    amount:{
      type:Datetypes.DECIMAL,
      allowNull:false
    },
    cpf:{
      type:Datetypes.STRING,
      allowNull:false
    },
    state:Datetypes.STRING,
    createdAt:Datetypes.DATE,
    updatedAt:Datetypes.DATE,
  },{
    tableName:'cart',
    timestamps:true,
  });

  Cart.associate = (models) => {
    Cart.belongsTo(models.Product, {
      foreignKey: 'product_id',
      as: 'product'
    });
  }

  return Cart;  
};
