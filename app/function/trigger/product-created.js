var _ = require('lodash')
var async = require('async')
var drupalService = require('../../service/drupalService')

migrateCreated = (body) => {
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
                executeDrupalService(body, callback)
                    .then(response => callback(null, response))
                    .catch(error => callback(error, null))
            },
            // 4. Get Product Details from CT to get Product-Number
            CTProductNumber = (body, callback) => {
                console.log('Inside Get Product Details Method')
                getCTProductDetails(body, callback)
            },
            // 5. Send Notofication eg(slack)
            SendNotification = (body, callback) => {
                console.log('Inside Send Notification Method')
                sendNotification(body, callback)
            }
        ], (err, response) => {
            if (err) 
                reject(err)
            else 
                resolve(response)
        })    
    })
}

filterCTPayload = (body, callback) => {
    callback(null, body)
}

constructDrupalPayload = (body, callback) => {
    callback(null, body)
}

getCTProductDetails = (body, callback) => {
    callback(null, body)
}

sendNotification = (body, callback) => {
    callback(null, body)
}

executeDrupalService = (body, callback) => {
    try {
        if (!_.isUndefined(body.productProjection)) {
            drupalService.createOrUpdateDRLEntity(process.env.DRUPAL_PRODUCT_SERVICE_URL, body.productProjection)
                .then(updatedProduct => callback(null, updatedProduct))
                .catch(error => callback(null, error))
        } else {
            //throw new Error('Hurrah')
            callback(null, [])
        }
    } catch (error) {
        callback(error, null)
    }
}

module.exports = {
    migrate: (body, callback) => migrateCreated(body, callback)
}