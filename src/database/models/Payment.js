
module.exports =  (sequelize, Datetypes) => {
  const Payment = sequelize.define('Payment',{
    payment_id:{
      type:Datetypes.INTEGER,
      autoIncrement:true,
      primaryKey:true,
      allowNull:false,
      unique:true
    },
    client_cpf:{
      type:Datetypes.STRING,
      allowNull:false,
    },
    cart_id:{
      type: Datetypes.INTEGER,
      allowNull:false,
    },
    payment_method:{
      type:Datetypes.STRING,
      allowNull:false,
    },
    payment_status:{
      type:Datetypes.INTEGER,
      allowNull:false,
    },  
    createdAt:Datetypes.DATE,
    updatedAt:Datetypes.DATE,
  },
  {
    tableName:'payment',
    timestamps:true,
  });

  Payment.associate = (models) => {
    Payment.belongsTo(models.Cart, {
      foreignKey: 'cart_id',
      as: 'cart',
    });
  }

  return Payment;  
};
