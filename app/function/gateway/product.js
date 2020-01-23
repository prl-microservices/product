var _ = require('lodash')
const productCreated = require('../trigger/product-created')
const productDeleted = require('../trigger/product-deleted')
const productImageAdded = require('../trigger/product-image-added')
const productPublished = require('../trigger/product-published')
const productSlugChanged = require('../trigger/product-slug-changed')
const productUnpublished = require('../trigger/product-unpublished')

migrate = (event, context, callback) => {
    console.log(`Environment Variable -> ' + ${process.env.DRUPAL_KEY}`)
    console.log(`Environment Variable -> ' + ${process.env.DRUPAL_SECRET}`)
    console.log(`Current Time -> ' + ${new Date().toTimeString()}`)
    console.log(`Payload from CT -> ' + ${event.body}`)

    event = JSON.parse(event)
    var ctBody = _.pick(event.body, 
                            [
                                'type', 
                                'productProjection', 
                                'removedImageUrls', 
                                'createdAt', 
                                'lastModifiedAt'
                            ]
                        )
    
    console.log('Payload from CT -> ' + ctBody)
    console.log(`Trigger Type = ${ctBody.type}`)
    
    var triggerType = ctBody.type
    syncDrupal(triggerType, ctBody)
        .then(response => {
            console.log(`Final Response ${response}`)
            //callback(null, response)
            callback(null,{
                "statusCode": 200,
                "headers": {
                    "my_header": "my_value"
                },
                "body": JSON.stringify({
                    "message" : "Failed : Body wont have needed attributes to procees"
                }),
                "isBase64Encoded": false
            })
        })
        .catch(error => {
            console.log(`Final Error ${error}`)
            callback(response, null)
        })
    
    /* //ONLY FOR TESTING PURPOSE
    const response = {
        statusCode: 200,
        body: JSON.stringify({
        message: `Hello, the current time is ${new Date().toTimeString()}.`,
        drupal_key: process.env.DRUPAL_KEY,
        drupal_secret: process.env.DRUPAL_SECRET,
        ctPayload: JSON.stringify(ctBody)
        }),
    };

    callback(null, response); */
}

syncDrupal = (triggerType, eventBody, callback) => {
    return new Promise((resolve, reject) => {
        switch(triggerType) {
            case 'ProductCreated':
                console.log('Inside Product Created')
                productCreated.migrate(eventBody)
                    .then(response => resolve(response))
                    .catch(error => reject(error))
                break;
            case 'ProductDeleted':
                productDeleted.migrate(eventBody)
                    .then(response => resolve(response))
                    .catch(error => reject(error))
                break;
            case 'ProductImageAdded':
                productImageAdded.migrate(eventBody)
                    .then(response => resolve(response))
                    .catch(error => reject(error))
                break;
            case 'ProductPublished':
                productPublished.migrate(eventBody)
                    .then(response => resolve(response))
                    .catch(error => reject(error))
                break;
            case 'ProductSlugChanged':
                productSlugChanged.migrate(eventBody)
                    .then(response => resolve(response))
                    .catch(error => reject(error))
                break;
            case 'ProductUnpublished':
                productUnpublished.migrate(eventBody)
                    .then(response => resolve(response))
                    .catch(error => reject(error))
                break;
            default:
                console.log('None of the Trigger Type met')
                reject(new Error('Not a Valid Trigger Type'))
        }
    })
}

module.exports = {
    migrate: (event, context, callback) => migrate(event, context, callback)
}