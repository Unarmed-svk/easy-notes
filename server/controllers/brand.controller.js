const { brandService } = require("../services");

const brandController = {
  async addBrand(req, resp, next) {
    try {
      const brand = await brandService.addBrand(req.body.brandname);
      resp.json(brand);
    } catch (err) {
      next(err);
    }
  },
  async getBrands(req, resp, next) {
    try {
      const brands = await brandService.getBrands(req.body);
      resp.json(brands);
    } catch (err) {
      next(err);
    }
  },
};

module.exports = brandController;
