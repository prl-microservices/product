var _ = require('lodash')
var async = require('async')
var drupalService = require('../../service/drupalService')

migratePublished = (body) => {
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
                console.log('Inside ExecuteDrlService Pub')
                executeDrupalService(body, callback)
                    // .then(response => {
                    //     console.log('ssssssssssss')
                    //     callback(null, response)
                    // })
                    // .catch(error => {
                    //     console.log('fsdfsdfdsfdsf')
                    //     callback(error, null)
                    // })
            }
        ], (err, master_response) => {
            if (err) { 
                console.log('Inside error block')
                reject(err)
            } else {
                console.log('Inside success block')
                resolve(master_response)
            }
        })    
    })
}

filterCTPayload = (body, callback) => {
    callback(null, body)
}

constructDrupalPayload = (body, callback) => {
    callback(null, body)
}

executeDrupalService = (body, callback) => {
    /* try {
        console.log('Product Created Service - Start')
        if (!_.isUndefined(body.productProjection)) {
            drupalService.createOrUpdateDRLEntity(process.env.DRUPAL_PRODUCT_SERVICE_URL, body.productProjection)
                .then(updatedProduct => callback(null, updatedProduct))
                .catch(error => callback(error, null))
        } else {
            console.log('Product Created Service - Empty')
            //callback("Failed : Body wont have needed attributes to procees", null)
            callback(null, {})
        }
    } catch (error) {
        console.log('Product Created Service - Error')
        callback(error, null)
    } */
    callback(null, body)
}

module.exports = {
    migrate: (body) => migratePublished(body)
}