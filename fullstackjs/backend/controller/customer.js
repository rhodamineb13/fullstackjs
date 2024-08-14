const express = require('express')
const client = require('../config/database')

const getCustomers = (req, res) => {
    client.query('SELECT * FROM customers ORDER BY id', (err, results) => {
        if (err) {
            throw error
        }
        res.status(200).json(results.rows)
    })
}

const addCustomers = (req, res) => {
    const request = {
        name: req.body.name,
        birth: req.body.birth,
        address: req.body.address
    }

    client.query(`INSERT INTO customers(name, birth, address)
        VALUES
        ($1, $2, $3)`, request.name, request.birth, request.address, (err, results) => {
            if (err) {
                throw error
            }
            res.status(201).json({
                message: "customer data successfully created",
                data: request
            })
        })
}

const deleteCustomers = (req, res) => {
    var id = parseInt(req.params.id)
    res.json(id)
}

const selectCustomers = (req, res) => {
    var id = parseInt(req.params.id)
    client.query('SELECT * FROM customers WHERE id = $1', (err, results) => {
        if (err) {
            throw error
        }
        res.status(200).json(results.rows)
    })
}




module.exports = { getCustomers, selectCustomers, addCustomers, deleteCustomers };