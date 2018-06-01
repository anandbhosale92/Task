# Heady.io Task

Restful API in node.js, mongoDB.
All Post request should be in JSON format.

### Installation

Install the dependencies and start the server.

```sh
$ cd Task
$ npm install
$ npm start
```

### Usage Example: 

#####  { Create New category }

###### Required Param : [name]
###### Required Param : [parent]^ Required while create child category, Parent categoryId need to be passed
Test Cases:- 
```sh
Url         : localhost:3000/category/add
http method : POST
Post Data  : {
                "name": "Electronics",
                "parentId": ""
            }
Response: {
            "msg": "Category added successfully",
            "categoryId": "5b11372ddbebe560f9a26ded"
        }
```
#####  { Get All category }
Test Cases:- 
```sh
Url         : localhost:3000/category/get
http method : GET
Response: [  
   {  
      "_id":"5b1134e552ac9660810fe38a",
      "name":"Electronics",
      "child_categories":[  
         {  
            "_id":"5b1134f252ac9660810fe38b",
            "name":"Mobile",
            "child_categories":[  
               {  
                  "_id":"5b11350a52ac9660810fe38d",
                  "name":"Apple",
                  "child_categories":[]
               },
               {  
                  "_id":"5b11351452ac9660810fe38e",
                  "name":"Samsung",
                  "child_categories":[]
               }
            ]
         },
         {  
            "_id":"5b1134f752ac9660810fe38c",
            "name":"camera",
            "child_categories":[  
               {  
                  "_id":"5b11372ddbebe560f9a26ded",
                  "name":"Cannon",
                  "child_categories":[ ]
               }
            ]
         }
      ]
   }
]

```

#####  { Add New Product }

###### Required Param : [name, price, category]
Test Cases:- 
```sh
Url         : localhost:3000/product/add
http method : POST
Post Data  : {
                "name": "Iphone 6s",
                "description": "Iphone 6s",
                "price": 45000,
                "category": [ "5b11350a52ac9660810fe38d", "5b1134f252ac9660810fe38b"]
            }
Response: {
                "msg": "Product added successfully",
                "productId": "5b113776dbebe560f9a26dee"
        }
```
#####  { GET PRODUCT BASED CATEGORY }
Test Cases:- 
```sh
Url         : localhost:3000/product/5b11350a52ac9660810fe38d {Category Id}
http method : GET
Response:   [
                {
                    "_id": "5b113776dbebe560f9a26dee",
                    "name": "Iphone 6s",
                    "description": "Iphone 6s",
                    "price": 50000
                }
            ]
```
#####  { UPDATE PRODUCT}
###### Required Param : [productId]

Test Cases:- 
```sh
Url         : localhost:3000/product/update/5b113776dbebe560f9a26dee {product Id}
http method : PATCH
POST Data   : {
                "price": 2500
            }
Response:   Response: {
                "msg": "Product updated successfully",
                "productId": "5b113776dbebe560f9a26dee"
        }
```
