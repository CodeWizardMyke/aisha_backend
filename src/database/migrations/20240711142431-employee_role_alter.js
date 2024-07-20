'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('employee', 'employye_office', 'employee_role');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('employee', 'employye_office', 'employee_role');
  }
};