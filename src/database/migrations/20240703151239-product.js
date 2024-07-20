'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.createTable('product',{
      product_id:{
        type:Sequelize.INTEGER,
        autoIncrement: true ,
        primaryKey:true,
        allowNull:false,
        unique:true
      },
      title:{
        type:Sequelize.STRING,
        allowNull:false
      },
      official_store_name:Sequelize.STRING,
      category:Sequelize.STRING,
      discribe:Sequelize.TEXT,
      currency_type:Sequelize.STRING,
      price:{
        type:Sequelize.DECIMAL,
        allowNull:false
      },
      originam_price:{
        type:Sequelize.DECIMAL,
        allowNull:false
      },
      sale_price:{
        type:Sequelize.DECIMAL,
        allowNull:false
      },
      stock:{
        type:Sequelize.INTEGER,
        allowNull:false
      },
      use_thumbnail:Sequelize.STRING,
      thumbnails:{
        type:Sequelize.STRING,
        allowNull:false
      },
      brand:{
        type:Sequelize.STRING,
        allowNull:false
      },
      gender:{
        type:Sequelize.STRING,
        allowNull:false
      },
      GTIN:Sequelize.STRING,
      item_condittion:Sequelize.STRING,
      line:{
        type:Sequelize.STRING,
        allowNull:false
      },
      NET_VOLUM:Sequelize.STRING,
      NET_WEIGHT:Sequelize.STRING,
      winner_item_id:Sequelize.STRING,
      catalog_listing:Sequelize.STRING,
      discounts:Sequelize.STRING,
      promotions:Sequelize.DECIMAL,
    })
  },

  async down (queryInterface, Sequelize) {
     await queryInterface.dropTable('product');
  }
};
