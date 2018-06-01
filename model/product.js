
module.exports = {
  async getProduct(data) {
    let query = { _id: objectID(data) };
    //CHECK FOR CATEGORY EXISTS OR NOT IF EXISTS THEN GET ITS CHILD CATEGORY IF PRESENT
    const result = await mongoClient.collection(categoryDB).find(query).toArray();
    if (result.length <= 0) {
      //NO CATEGORY FOUND FOR FOLLOWING ID THROW ERROR
      throw 8;
    }

    //CATEGORY FOUND THEN CHECK FOR ITS CHILD CATEGORY
    //QUERY ON ANCESTOR FIELD TO CHECK IF FOLLOWING CATEGORY HAS CHILD CATEGORY OR NOT
    const childQuery = {};
    childQuery.ancestors = data;

    //FIND QUERY
    const childCategory = await mongoClient.collection(categoryDB).find(childQuery).toArray();

    const searchProductCategory = [];
    searchProductCategory.push(result[0]._id);

    if (childCategory.length > 0) {
      //CHILD CATEGORY PRESENT GET THE IDS OF FOLLOWING SUB CATEGORIES
      for (let i = 0; i < childCategory.length; i++) {
        searchProductCategory.push(childCategory[i]._id);
      }
    }

    //ALL SET NOW GET ALL PRODUCT FROM FILTERED CATEGORIES
    const productQuery    = {};
    productQuery.category = { $in: searchProductCategory };

    const projection = {
      _id: 1, name: 1, price: 1, description: 1
    };

    let productList = await mongoClient.collection(productDB).find(productQuery, projection).toArray();

    //GET CATEGORY NAME AND STORE AGAINST PRODUCT CATEGORY KEY
    // for (let j = 0; j < productList.length; j++) {
    //   //GET CATEGORYID AND CHECK IN CHILD CATEGORY, MAIN CATEGORY AND RETURN CATEGORY NAME
    //   productList[j].category.forEach(function (element, i) {
    //     let isExists = categoryExists(childCategory, element);

    //     if (!isExists) {
    //       //CHECK FOR MAIN CATEGORY
    //       isExists     = categoryExists(result, element);
    //     }

    //     if (isExists) {
    //       productList[j].category[i] = isExists.name;
    //     }
    //   });
    // }

    return await productList;
  },

  async addProduct(data) {

    //CHECK FOR CATEGORY PASSED ISEXISTS IN OUR SYSTEM
    const checkQuery = { _id: { $in: data.category } };
    const categories = await mongoClient.collection(categoryDB).find(checkQuery).toArray();

    if (categories.length < 0 || categories.length !== data.category.length) {
      throw 11;
    }

    let result = await mongoClient.collection(productDB).insert(data);

    return await result;
  },

  async updateProduct(data) {
    //CHECK FOR PRODUCT EXISTS
    const checkQuery = { _id: objectID(data.productId) };
    const product    = await mongoClient.collection(productDB).findOne(checkQuery);

    if (!product) {
      throw 13;
    }

    delete data.productId;
    const objData = ['name', 'description', 'price'];
    const temp    = {};
    for (var key in data) {
      /**
       * 1.Condition check for object has key
       * 2.key is not null or undefined
       * 3.if key is passed in objData exist in it
       */
      if (data[key] && objData.includes(key)) {
        temp[key] = data[key];
      }
    }

    let result = await mongoClient.collection(productDB).update(checkQuery, { $set: temp }, { upsert: true });

    if (result.result.ok === 1) {
      return await true;
    }

    return await false;
  }
};

function categoryExists(arrCategories, categoryId) {
  return arrCategories.find(function (el) {

    if (el._id.toString() == categoryId) {
      return el;
    }
  });
}
