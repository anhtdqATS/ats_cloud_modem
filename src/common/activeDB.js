const findById = async (model, id, projection = {}, populate = []) => {
  try {
    const user = await model.findById(id, projection).populate(populate);
    return user;
  } catch (error) {
    return error;
  }
};

module.exports = { findById };
