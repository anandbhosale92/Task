const category = require('../model/category');
const sendResp = require('../handlers/sendResponse');

const response = {};
module.exports = {
  async all(req, res, next) {
    try {
      response.res  = res;
      response.type = 'S';
      const resp = await category.getAllCategory();
      if (resp) {
        response.result = resp;
        sendResp.sendResponse(response);
        return;
      }
    }
    catch (e) {
      response.type = 'E';
      response.code = 1;
      if (typeof e === 'number') {
        response.code = e;
      }

      sendResp.sendResponse(response);
      return;
    }
  },
  async add(req, res, next) {
    //VALIDATION PART
    response.res = res;
    let data     = req.body;

    if (!data.name) {
      response.type = 'E';
      response.code = 3;

      sendResp.sendResponse(response);
      return;
    }

    //ALL SET
    try {
      const resp = await category.addCategory(data);
      if (resp) {
        const respTxt   = { msg: "Category added successfully", categoryId: resp.insertedIds[0] };
        response.result = respTxt;
        response.type = 'S';

        sendResp.sendResponse(response);
        return;
      }
    }
    catch (e) {
      response.type = 'E';
      response.code = 4;
      if (typeof e === 'number') {
        response.code  = e;
      }

      sendResp.sendResponse(response);
      return;
    }
  }
};
