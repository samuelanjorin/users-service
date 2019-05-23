/* eslint-disable camelcase */

export default (sequelize, Sequelize) => {
  const customerSchema = {
    customer_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
      allowNull: false
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    address_1: {
      type: Sequelize.STRING

    },
    address_2: {
      type: Sequelize.STRING
    },
    city: {
      type: Sequelize.STRING
    },
    region: {
      type: Sequelize.STRING
    },
    postal_code: {
      type: Sequelize.STRING
    },
    day_phone: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING
    },
    shipping_region_id: {
      type: Sequelize.INTEGER
    },
    eve_phone: {
      type: Sequelize.STRING
    },
    mob_phone: {
      type: Sequelize.STRING
    },
    country: {
      type: Sequelize.STRING
    },
    credit_card: {
      type: Sequelize.STRING
    }
  }
  const customers = sequelize.define('customer', customerSchema, {
    freezeTableName: true,
    timestamps: false
  })
  return customers
}
