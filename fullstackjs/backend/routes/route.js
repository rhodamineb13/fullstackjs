const express = require('express')
const controller = require("../controller/customer")
const route2 = express.Router()

route2.get("/api/v1/customers", controller.getCustomers)
route2.get("/api/v1/customers/:id", controller.selectCustomers)
route2.post("/api/v1/customers", controller.addCustomers)
route2.delete("/api/v1/customers/:id", controller.deleteCustomers)

module.exports = route2