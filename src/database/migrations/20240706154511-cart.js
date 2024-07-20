'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.createTable('cart', {
      cart_id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true,
        unique:true
      },
      user_name:Sequelize.STRING,
      product_id:{
        type: Sequelize.INTEGER,
        references: {
          model: 'product',
          key: 'product_id'
        }
      },
      qtd_product:{
        type:Sequelize.INTEGER,
        allowNull:false
      },
      amount:{
        type:Sequelize.DECIMAL,
        allowNull:false
      },
      cpf:{
        type:Sequelize.STRING,
        allowNull:false
      },
      state:Sequelize.STRING,
      createdAt:Sequelize.DATE,
      updatedAt:Sequelize.DATE,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('cart');
  }
};
