const { tradeSchema } = require('./utilSchema');
const validator = require('jsonschema').Validator;
const v = new validator();

/**
 * validate request body
 * 
 * @param {object} trade trade received in request body
 */
const validateTrade = (trade) => {
    const validationResult = v.validate(trade, tradeSchema);
    if (validationResult.errors.length !== 0) {
        const errorFields = validationResult.errors.map(field => {
            if(field.name === 'required'){
                return { [field.argument]: 'field is mandatory'};
            } else {
                const extractedField = field.property.split('.').pop();
                return { [extractedField]: field.message};
            }
        })
        console.log({Error:errorFields});
    }
};

/**
 * export
 */
module.exports = { validateTrade };