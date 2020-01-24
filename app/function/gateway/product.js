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
    console.log('Payload from CT SQS -> ' + _.isObject(event) ? JSON.stringify(event) : event)
    console.log(`Payload from CT -> ' + ${event}`)

    event = !_.isObject(event) ? JSON.parse(event) : event
    var ctBody = !_.isObject(event.Records[0].body) ? JSON.parse(event.Records[0].body) : event.Records[0].body
    /* ctBody = _.pick(ctBody, 
                            [
                                'type', 
                                'productProjection', 
                                'removedImageUrls', 
                                'createdAt', 
                                'lastModifiedAt'
                            ]
                        ) */
    console.log('Payload from CT -> ' + _.isObject(ctBody) ? JSON.stringify(ctBody) : ctBody)
    console.log(`Trigger Type = ${ctBody.type}`)
    
    var triggerType = ctBody.type
    syncDrupal(triggerType, ctBody)
        .then(response => {
            console.log(`Lambda Response ${response}`)
            response = _.isObject(response) ? response : JSON.stringify(response)
            //callback(null, response)
            callback(null,{
                "statusCode": 200,
                "headers": {
                    "my_header": "my_value"
                },
                "body": JSON.stringify({
                    "message" : "Failed : Body wont have needed attributes to procees"
                }),
                "response" : response,
                "isBase64Encoded": false
            })
        })
        .catch(error => {
            console.log(`Lambda Error ${error}`)
            error = _.isObject(error) ? error : JSON.stringify(error)
            //callback(error, null)
            callback({
                "statusCode": 502,
                "headers": {
                    "my_header": "my_value"
                },
                "body": JSON.stringify({
                    "message" : "Failed : Body wont have needed attributes to procees"
                }),
                "response" : error.message,
                "isBase64Encoded": false
            }, null)
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