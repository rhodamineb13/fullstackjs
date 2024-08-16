const express = require('express')
const client = require('../config/database')

const queryGet = `SELECT c.name, c.level, f.name, o.quantity, (f.price * o.quantity)
FROM orders o
INNER JOIN customers c ON o.cust_id = c.id
INNER JOIN foods f ON o.food_id = f.id
WHERE o.deleted_at IS NOT NULL
ORDER BY o.created_at DESC`

const queryFindCust = `SELECT c.id, c.name FROM customers c WHERE c.name ILIKE $1`

const queryInsertNewCustomer = `INSERT INTO customers(name, level)
VALUES
($1, "Warga")
RETURNING id`

const queryInsertNewOrder = `INSERT INTO orders(cust_id, food_id, quantity, created_at)
VALUES
($1, $2, $3, NOW())`

const queryEditCustomerLevel = `UPDATE customers SET level = $1 WHERE id = $2`

const queryDeleteOrders = `UPDATE orders SET o.deleted_at = NOW() WHERE id = $1`

const querySelectOrder = `SELECT c.name, c.level, f.name, o.quantity, (f.price * o.quantity)
FROM orders o
INNER JOIN customers c ON o.cust_id = c.id
INNER JOIN foods f ON o.food_id = f.id
WHERE id = $1`

const queryEditOrder = `UPDATE orders
SET food_id = $1, quantity = $2
WHERE orders = $3`



const getCustomers = (req, res) => {
    client.query(queryGet, (err, results) => {
        res.status(200).json(results.rows)
    })
}

const addCustomers = async (req, res) => {

    var request = {
        cust_id: 0,
        food_id: req.body.food_id,
        quantity: req.body.quantity,
    }

    try {
        await client.query(queryFindCust, req.body.name, (err, result) => {
            if (!!err) {
                request.cust_id = result.rows[0].id
                return
            }
    
            })
    } catch (e) {
        try {
            await client.query("BEGIN")
            await client.query(queryInsertNewCustomer, req.body.name, (err, result) => {
                if (err) {
                    throw err
                }
                request.cust_id = result.rows[0].id
            })
            await client.query("COMMIT")
        } catch (err) {
            await client.query("ROLLBACK")
            res.status(500).json({message: "unexpected error adding customer"})
        }
        
    }
    
    try {
        await client.query("BEGIN")
        await client.query(queryInsertNewOrder, request.id, request.food_id, request.quantity, (err, results) => {
            if (err) {
                throw err
            }
            res.status(201).json({
                message: "customer data successfully created",
                data: request
            })
        })
    } catch (e) {
        await client.query("ROLLBACK")
        res.status(500).json({message: "unexpected error adding order "})
    }
    
}

const deleteCustomers = async (req, res) => {
    var id = parseInt(req.params.id)
    
    try {
        await client.query("BEGIN")
        await client.query(queryDeleteOrders)
        await client.query("COMMIT")
    } catch (e) {
        await client.query("ROLLBACK")
        res.status(500).json({message: "unexpected error deleting order: "})
    }
}

const selectCustomers = async (req, res) => {
    var id = parseInt(req.params.id)
    client.query(querySelectOrder, (err, results) => {
        if (err) {
            res.status(400).json({message: "id not found"})
            return
        }
        res.status(200).json(results.rows)
    })
}

const editCustomerOrder = async (req, res) => {
    var id = parseInt(req.params.id)
    await client.query(querySelectOrder, (err, results) => {
        if (req.body.food_id == 0) {
            req.body.food_id = results.rows[0].food_id
        }
        if (req.body.quantity == 0) {
            req.body.quantity = results.rows[0].quantity
        }
    })

    try {
        await client.query("BEGIN")
        await client.query(queryEditOrder, req.body.food_id, req.body.quantity, req.body.id)
        await client.query("COMMIT")
    } catch (e) {
        await client.query("ROLLBACK")
        res.json({message: err})
    }
    
}




module.exports = { getCustomers, selectCustomers, addCustomers, deleteCustomers };