const Products = {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Products",
  "type": "object",
  "properties": {
    "id": {
      "type": "integer",
      "description": "Unique identifier for the product (primary key)"
    },
    "title": {
      "type": "string",
      "maxLength": 200,
      "description": "Product title or name"
    },
    "description": {
      "type": "string",
      "description": "Detailed description of the product"
    },
    "category": {
      "type": "string",
      "enum": [
        "beauty",
        "fragrances",
        "furniture",
        "groceries",
        "home-decoration",
        "kitchen-accessories",
        "laptops",
        "mens-shirts",
        "mens-shoes",
        "mens-watches",
        "mobile-accessories",
        "motorcycle",
        "skin-care",
        "smartphones",
        "sports-accessories",
        "sunglasses",
        "tablets",
        "tops",
        "vehicle",
        "womens-bags",
        "womens-dresses",
        "womens-jewellery",
        "womens-shoes",
        "womens-watches"
      ],
      "description": "Category of the product"
    },
    "img": {
      "type": "string",
      "format": "uri",
      "description": "URL of the product image"
    },
    "price": {
      "type": "number",
      "multipleOf": 0.01,
      "description": "Product price (up to 2 decimal places)"
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
      "description": "Soft delete timestamp (if paranoid mode is enabled)"
    }
  },
  "required": ["title", "description", "category", "imgUrl", "price"],
  "additionalProperties": false
}


module.exports = Products;
