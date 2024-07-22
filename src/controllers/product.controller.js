import { createProduct, findProduct, findAndUpdateProduct, deleteProduct, findAll } from "../services/product.service.js";

export async function createProductHandler(req, res) {
  const body = req.body;
  const product = await createProduct({ ...body });
  return res.status(201).send(product);
}

export async function getAllProductHandler(req, res) {
  const product = await findAll();
  return res.send(product);
}
export async function getProductHandler(req, res) {
  const productId = req.params.productId;
  const product = await findProduct({ productId });
  if (!product) {
    return res.sendStatus(404);
  }
  return res.send(product);
}

export async function updateProductHandler(req, res) {
  const productId = req.params.productId;
  const update = req.body;
  const product = await findProduct({ productId });
  if (!product) {
    return res.status(404).send({ message: "Product not found" });
  }
  const updatedProduct = await findAndUpdateProduct({ productId }, update ,{
    new: true,
  });
  return res.send(updatedProduct);
}

export async function deleteProductHandler(req, res) {
  const productId = req.params.productId;
  const product = await findProduct({ productId });
  if (!product) {
    return res.status(404).send({ message: "Product not found" });
  }
  await deleteProduct({ productId });
  return res.sendStatus(204);
}