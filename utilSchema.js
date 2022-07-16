/**
 * POST request schema
 *
 */
const tradeSchema = {
    'id': '/tradesSchema',
    'type': 'object',
    'properties': {
        'type': {
            'type': 'string',
            'minLength': 1,
            'enum': ['buy', 'sell']
        },
        'user_id': {
            'type': 'number',
            'minLength': 1
        },
        'symbol': {
            'type': 'string',
            'minLength': 1
        },
        'shares': {
            'type': 'number',
            'minLength': 1,
            'maxLength': 100
        },
        'price': {
            'type': 'number',
            'minLength': 1
        }
    },
    'required': ['type', 'user_id', 'symbol', 'shares', 'price']
}

/**
 * export
 */
module.exports = { tradeSchema };