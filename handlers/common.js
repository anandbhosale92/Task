module.exports = {
  checkEmptyValue(data, requiredData) {
    for(var i = 0; i < requiredData.length; i++) {
      if(!data.hasOwnProperty(requiredData[i]) || !data[requiredData[i]] || (Array.isArray(data[requiredData[i]]) &&  data[requiredData[i]].length <= 0 ) ) {
        return false;
      }
    }
    return true;
  }
};
