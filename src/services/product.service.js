import ProductModel from "../models/product.model.js";

export async function createProduct(input) {
  return ProductModel.create(input);
}

export async function findAll() {
  return ProductModel.find();
}
export async function findProduct(query) {
  return ProductModel.findOne(query);
}

export async function findAndUpdateProduct(query, update, options) {
  return ProductModel.findOneAndUpdate(query, update, options);
}

export async function deleteProduct(query) {
  return ProductModel.deleteOne(query);
}