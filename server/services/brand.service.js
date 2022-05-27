const httpStatus = require("http-status");
const { ApiError } = require("../middleware/apiError");
const { Brand } = require("../models/brand");

const addBrand = async (brandname) => {
  try {
    const brand = new Brand({ name: brandname });
    await brand.save();

    return brand;
  } catch (err) {
    throw err;
  }
};

const getBrands = async (args) => {
  try {
    const order = args.order || "asc";
    const limit = args.limit || 10;

    const brands = await Brand.find({}).sort({ _id: order }).limit(limit);

    if (!brands) throw new ApiError(httpStatus.NOT_FOUND, "No brands were found");

    return brands;
  } catch (err) {
    throw err;
  }
};

module.exports = { addBrand, getBrands };
