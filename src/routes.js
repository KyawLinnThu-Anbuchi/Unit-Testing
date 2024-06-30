import { createProductHandler, deleteProductHandler, getAllProductHandler, getProductHandler, updateProductHandler } from './controllers/product.controller.js';

function routes(app) {
  app.post(
    "/api/products",
    createProductHandler
  );

  app.get(
    "/api/products",
    getAllProductHandler

  )
  app.get(
    "/api/products/:productId",
    getProductHandler
  );

  app.put(
    "/api/products/:productId",
    updateProductHandler
  );

  app.delete(
    "/api/products/:productId",
    deleteProductHandler
  );
}

export default routes;