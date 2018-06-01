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
    const tree = {_id:null};
    /**
     *CHECK FOR CATEGORIES WHICH HAS PARENTID = NULL
     * THEN CHECK THOSE PARENT CATEGORY HAS ANY CHILD IF YES THEN ADD THAT CATEGORY UNDER CHILD KEY
    */
    addChildrenToNode(tree, result);

    //FILTERED OUT ONLY SHOW PARENT CATEGORY
    result = result.filter(function (categories) {
      return categories.parent === null & delete categories.parent;
    });


    return await result;
  }
};

const addChildrenToNode = function (node, result) {
  let currentNodeId = node._id;
  node.child_categories = [];

  result.forEach(function (e) {
    delete e.ancestors;

    e.parent      = e.parent ? e.parent.toString() : e.parent;
    currentNodeId = currentNodeId ? currentNodeId.toString() : currentNodeId;

      if(e.parent === currentNodeId){
        e = addChildrenToNode(e, result);
        node.child_categories.push(e);
      }
  });

  return node;
};

