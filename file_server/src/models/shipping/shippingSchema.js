const Shipping = {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Shipping",
  "type": "object",
  "properties": {
    "id": {
      "type": "integer",
      "description": "Auto-incrementing primary key"
    },
    "name": {
      "type": "string",
      "description": "user name"
    },
    "email": {
      "type": "string",
      "description": "user email"
    },
    "userId": {
      "type": "integer",
      "description": "Foreign key referencing the user ID"
    },
    "address": {
      "type": "string",
      "description": "Shipping address of the user"
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
      "description": "Soft delete timestamp (if paranoid mode is on)"
    }
  },
  "required": ["name", "email", "userId", "address"],
  "additionalProperties": false
}


module.exports = Shipping;
