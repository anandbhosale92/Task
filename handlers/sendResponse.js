
const errMsg = [];

errMsg[1] = 'Unable to process request. Please try again later.';
errMsg[2] = 'No Categories found.';
errMsg[3] = 'Required field not passed.';
errMsg[4] = 'Unable to process request. Please try again later.';
errMsg[5] = 'No category found against parent field.';

errMsg[6] = 'Unable to process request. Please try again later.';
errMsg[7] = 'Invalid Cateory Id passed.';
errMsg[8] = 'No product found for following category.';
errMsg[9] = 'Required field not passed.';
errMsg[10] = 'Unable to process request. Please try again later.';
errMsg[11] = 'Category passed does not exists in system.';
errMsg[12] = 'Invalid productId passed.';
errMsg[13] = 'No product found against following Id.';
errMsg[14] = 'Unable to process request. Please try again later.';
errMsg[15] = 'Unable to process request. Please try again later.';

module.exports = {
  sendResponse(data) {

    //ERROR REQUEST
    if (data.type === 'E') {
      data.res.status(400).json({ msg: errMsg[data.code], code : data.code });
      return;
    }

    data.res.status(200).json(data.result);
    return;
  }
};
