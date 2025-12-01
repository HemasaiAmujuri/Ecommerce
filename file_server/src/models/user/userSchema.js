const userSchema = {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "User",
  "type": "object",
  "properties": {
    "id": { "type": "integer" },
    "name": { "type": "string", "maxLength": 30 },
    "email": { "type": "string", "format": "email", "maxLength": 50 },
    "mobile": { "type": "string" },
    "password": { "type": "string" },
    "createdAt": { "type": "string", "format": "date-time" },
    "updatedAt": { "type": "string", "format": "date-time" },
    "deletedAt": { "type": ["string", "null"], "format": "date-time" }
  },
  "required": ["name", "email", "mobile", "password"],
  "additionalProperties": false
};

module.exports = userSchema;
