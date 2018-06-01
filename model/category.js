module.exports = {
  async addCategory(data) {
    //CHECK IF CATEGORY HAS ANY PARENT CATEGORY OR NOT
    const dbParam     = {};
    dbParam.name      = data.name;
    dbParam.ancestors = [];
    dbParam.parent    = null;

    if (data.parentId) {
      //CHECK IF PARENT CATEGORY HAS ANY ANCESTORS IF YES GET AND APPEND TO RESULT
      //IF NOT THEN APPEND PARENT CATEGORY TO ANCESTORS AGAINST CHILD CATEGORY AND STORE IT
      const query = { _id: objectID(data.parentId) };
      let result = await mongoClient.collection(categoryDB).find(query).toArray();

      if(result.length <= 0) {
        //NO EXISITING CATEGORY FOUND AGAINST FOLLOWING PARENTID THROW ERROR
        throw 5;
      }

      //APPEND PARENT ID TO MAIN PARENT CATEGORY ANCESTORS
      result[0].ancestors.push(objectID(data.parentId));

      dbParam.ancestors = result[0].ancestors;
      dbParam.parent = objectID(data.parentId);

    }

    //STORE IN DB
    return await mongoClient.collection(categoryDB).insert(dbParam);

  },
  async getAllCategory() {
    const query = {};
    let result = await mongoClient.collection(categoryDB).find(query).toArray();

    if (result.length <= 0) {
      throw 2;
    }
    const defaultValue = {_id:null};
    /**
     *CHECK FOR CATEGORIES WHICH HAS PARENTID = NULL
     * THEN CHECK THOSE PARENT CATEGORY HAS ANY CHILD IF YES THEN ADD THAT CATEGORY UNDER CHILD KEY
    */
    addChildrenToCategory(defaultValue, result);

    //FILTERED OUT ONLY SHOW PARENT CATEGORY
    result = result.filter(function (categories) {
      return categories.parent === null & delete categories.parent;
    });


    return await result;
  }
};

/**
 * FUNCTION TO ADD CHILD CATEGORY UNDER PARENT CATEGORY
 * @param {*} categories - Categories initially will be blank
 * @param {*} result     - All category result which needs to be formatted
 */
const addChildrenToCategory = function (categories, result) {
  let currentCatId = categories._id;
  categories.child_categories = [];

  result.forEach(function (e) {
    delete e.ancestors;

    e.parent     = e.parent ? e.parent.toString() : e.parent;
    currentCatId = currentCatId ? currentCatId.toString() : currentCatId;

    if(e.parent === currentCatId){
      e = addChildrenToCategory(e, result);
      categories.child_categories.push(e);
    }
  });

  return categories;
};

