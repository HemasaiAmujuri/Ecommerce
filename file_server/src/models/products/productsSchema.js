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
      "type": "object",
      "description": "Product images stored as JSON (can contain multiple URLs or image info)"
    },
    "price": {
      "type": "number",
      "multipleOf": 0.01,
      "description": "Product price (up to 2 decimal places)"
    },
  },
  "required": ["title", "description", "category", "img", "price"],
  "additionalProperties": false
}


module.exports = Products;
