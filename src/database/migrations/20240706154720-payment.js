'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('payment', {
      payment_id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false,
        unique:true
      },
      client_cpf:{
        type:Sequelize.STRING,
        allowNull:false,
      },
      cart_id:{
        type: Sequelize.INTEGER,
        references: {
          model: 'cart',
          key: 'cart_id'
        }
      },
      payment_method:{
        type:Sequelize.STRING,
        allowNull:false,
      },
      payment_status:{
        type:Sequelize.INTEGER,
        allowNull:false,
      },  
      createdAt:Sequelize.DATE,
      updatedAt:Sequelize.DATE,
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('payment')
  }
};
