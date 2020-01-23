var product = require('../../app/function/gateway/product');
var async = require('async')

module.exports = {
    migrateProducts: (req, res, next) => {
        async.waterfall([
            createProduct = (callback) => {
                product.migrate(JSON.stringify(req.body), null, callback)
            }
        ], (error, response) => {
            if (error) {
                res.status(200).send(error)
            } else {
                res.status(200).send(response);
            }
        })
    }
}