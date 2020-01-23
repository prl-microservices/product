var _ = require('lodash')
var async = require('async')
var drupalService = require('../../service/drupalService')

migrateSlugChanged = (body, callback) => {
    return new Promise((resolve, reject) => {
        async.waterfall([
            // 1. Get required fields from CT response Payload
            CTPayload = (callback) => {
                console.log('Inside CTPayload')
                filterCTPayload(body, callback)
            },
            // 2. Construct Drupal Payload
            DrlPayload = (body, callback) => {
                console.log('Inside DrlPayload')
                constructDrupalPayload(body, callback)
            },
            // 3. Execute Drupal Service with above payload
            ExecuteDrlService = (body, callback) => {
                console.log('Inside ExecuteDrlService')
                executeDrupalService(body)
                    .then(response => callback(null, response))
                    .catch(error => callback(error, null))
            }
        ], (err, response) => {
            if (err) 
                reject(callback(err,null))
            else 
                resolve(callback(null,response))
        })    
    })
}

filterCTPayload = (body, callback) => {
    callback(null, body)
}

constructDrupalPayload = (body, callback) => {
    callback(null, body)
}

executeDrupalService = (body) => {
    return new Promise((resolve, reject) => {
        try {
            console.log('Product Created Service - Start')
            if (!_.isUndefined(body.productProjection)) {
                drupalService.createOrUpdateDRLEntity(process.env.DRUPAL_PRODUCT_SERVICE_URL, body.productProjection)
                    .then(updatedProduct => resolve(updatedProduct))
                    .catch(error => reject(error))
            } else {
                console.log('Product Created Service - Empty')
                resolve([])
            }
        } catch (error) {
            console.log('Product Created Service - Error')
            reject(error)
        }
    })
}

module.exports = {
    migrate: (body, callback) => migrateSlugChanged(body, callback)
}