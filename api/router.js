const express = require('express')
var router = express.Router()
var product = require('./app/product')

router.post('/migrate', product.migrateProducts)

module.exports = router