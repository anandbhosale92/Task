const product        = require('../model/product');
const commonFunction = require('../handlers/common');
const sendResp       = require('../handlers/sendResponse');

const response = {};
module.exports = {
  async get(req, res, next) {
    response.res = res;
    //VALIDATION PART
    const cateogryId = req.params.categoryId;

    if (!objectID.isValid(cateogryId)) {
      response.type = 'E';
      response.code = 7;

      sendResp.sendResponse(response);
      return;
    }

    //VALIDATION SUCCESSFULL MOVE FORWARD
    //GET CATEGORY DATA
    try {
      const resp = await product.getProduct(cateogryId);
      response.type = 'S';
      response.result = resp;
      //ALL FINE RETURN RESULT
      sendResp.sendResponse(response);
    }
    catch (e) {

      response.type = 'E';
      response.code = 6;
      if (typeof e === 'number') {
        response.code = e;
      }

      sendResp.sendResponse(response);
    };
  },
  async add(req, res, next) {
    response.res = res;

    let data = req.body;

    //VALIDATION PART
    //CHECK IF REQUIRE FIELD ARE PASSED OR NOT
    const requiredParam = ['name', 'price', 'category'];
    if (!commonFunction.checkEmptyValue(data, requiredParam)) {
      response.type = 'E';
      response.code = 9;

      sendResp.sendResponse(response);
    }

    for (let c = 0; c < data.category.length; c++) {
      if (!objectID.isValid(data.category[c])) {
        response.type = 'E';
        response.code = 9;

        sendResp.sendResponse(response);
        return;
      }

      data.category[c] = objectID(data.category[c]);
    }
    //ALL SET
    try {
      const resp = await product.addProduct(data);
      if (resp) {
        const resTxt = { msg: "Product added successfully", productId: resp.insertedIds[0] };
        response.type   = 'S';
        response.result = resTxt;

        sendResp.sendResponse(response);
      }
     }
    catch (e) {
      response.type = 'E';
      response.code = 10;

      if (typeof e === 'number') {
        response.code = e;
      }

      sendResp.sendResponse(response);
    }
  },
  async update(req, res, next) {
    //VALIDATION PART
    response.res = res;
    let data = req.body;

    const productId = req.params.productId;

    if (!objectID.isValid(productId)) {
      response.type = 'E';
      response.code = 12;

      sendResp.sendResponse(response);
      return;
    }
    data.productId = productId;
    //ALL SET
    try {
      const resp = await product.updateProduct(data);
      if (resp) {
        const respTxt = { msg: "Product updated successfully", productId: productId };
        response.type = 'S';
        response.result = respTxt;
        //ALL FINE RETURN RESULT
        sendResp.sendResponse(response);
        return;
      }

      throw 14;
     }
    catch (e) {
      response.type = 'E';
      response.code = 15;
      if (typeof e === 'number') {
        response.code = e;
      }

      sendResp.sendResponse(response);
      return;
    }
  }
};
