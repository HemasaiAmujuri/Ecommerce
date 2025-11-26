const Cart = {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Cart",
  "type": "object",
  "properties": {
    "id": {
      "type": "integer",
      "description": "Auto-incrementing primary key"
    },
    "userId": {
      "type": "integer",
      "description": "Foreign key referencing Users.id"
    },
    "productId": {
      "type": "integer",
      "description": "Foreign key referencing Products.id"
    },
    "quantity": {
      "type": "integer",
      "default": 1,
      "description": "Quantity of product in the cart"
    },
    "createdAt": {
      "type": "string",
      "format": "date-time",
      "description": "Record creation timestamp"
    },
    "updatedAt": {
      "type": "string",
      "format": "date-time",
      "description": "Record update timestamp"
    },
    "deletedAt": {
      "type": ["string", "null"],
      "format": "date-time",
      "description": "Soft delete timestamp (for paranoid mode)"
    }
  },
  "required": ["userId", "productId"],
  "additionalProperties": false
}



module.exports = Cart;