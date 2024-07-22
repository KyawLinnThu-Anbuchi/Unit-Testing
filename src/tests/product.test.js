import supertest from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import createServer from "../utils/server.js";
import mongoose from "mongoose";
import { createProduct } from "../services/product.service.js";

const app = createServer();

export const productPayload = {
  title: "Title",
  description: "Description",
};

export const updateProductPayload = {
  title: "Title Edit",
  description: "Description",
};

describe("Product", () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();
    mongoose.set("strictQuery", false);
    mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  describe("Create products", () => {
    test("Should return 201", async () => {
      const { statusCode, body } = await supertest(app)
        .post("/api/products")
        .send(productPayload);

      expect(statusCode).toBe(201);
    });

    test("Should create the product", async () => {
      const { statusCode, body } = await supertest(app)
        .post("/api/products")
        .send(productPayload);

      expect(body).toEqual({
        __v: 0,
        _id: expect.any(String),
        createdAt: expect.any(String),
        description: "Description",
        productId: expect.any(String),
        title: "Title",
        updatedAt: expect.any(String),
      });
    });
  });

  describe("Find the product", () => {
    const productId = "product-123";
    test("Should return 404 when product not found", async () => {
      await supertest(app).get(`/api/products/${productId}`).expect(404);
    });

    test("should return 200 status when product found", async () => {
      const product = await createProduct(productPayload);
      const { body, statusCode } = await supertest(app).get(
        `/api/products/${product.productId}`
      );
      expect(statusCode).toBe(200);
    });

    test("should return product", async () => {
      const product = await createProduct(productPayload);
      const { body, statusCode } = await supertest(app).get(
        `/api/products/${product.productId}`
      );
      expect(body.productId).toBe(product.productId);
    });
  });

  describe("Get All products", () => {
    test("Should return a 200 status", async () => {
      var { statusCode: postStatusCode } = await supertest(app)
        .post("/api/products")
        .send(productPayload);
      expect(postStatusCode).toBe(201);

      var { statusCode: getStatusCode } = await supertest(app).get(
        "/api/products"
      );

      expect(getStatusCode).toBe(200);
    });

    test("Should get all products", async () => {
      var { statusCode: postStatusCode } = await supertest(app)
        .post("/api/products")
        .send(productPayload);
      expect(postStatusCode).toBe(201);

      var { body, statusCode: getStatusCode } = await supertest(app).get(
        "/api/products"
      );

      expect(body[0]).toEqual({
        __v: 0,
        _id: expect.any(String),
        createdAt: expect.any(String),
        description: "Description",
        productId: expect.any(String),
        title: "Title",
        updatedAt: expect.any(String),
      });
    });
  });

  describe("Update product", () => {
    test("Update non-existent product should return 404", async () => {
      const nonExistentProductId = "nonExistentProductId";
      const { statusCode, body } = await supertest(app)
        .put(`/api/products/${nonExistentProductId}`)
        .send(updateProductPayload);

      // Check for 404 status code
      expect(statusCode).toBe(404);
      expect(body).toEqual({
        message: "Product not found",
      });
    });

    test("Should update the products & status must be 200", async () => {
      const product = await createProduct(productPayload);
      var { statusCode, body } = await supertest(app)
        .put(`/api/products/${product.productId}`)
        .send(updateProductPayload);

      expect(statusCode).toBe(200);

      expect(body).toEqual({
        __v: 0,
        _id: expect.any(String),
        createdAt: expect.any(String),
        description: "Description",
        productId: expect.any(String),
        title: "Title Edit",
        updatedAt: expect.any(String),
      });
    });
  });

  describe("Delete products route", () => {
    test("Delete non-existent product should return 404", async () => {
      const nonExistentProductId = "nonExistentProductId";
      const { statusCode, body } = await supertest(app).delete(
        `/api/products/${nonExistentProductId}`
      );
      expect(statusCode).toBe(404);
      expect(body).toEqual({
        message: "Product not found",
      });
    });

    test("should return a 204 status and delete one product", async () => {
      const product = await createProduct(productPayload);
      const { statusCode } = await supertest(app).delete(
        `/api/products/${product.productId}`
      );
      expect(statusCode).toBe(204);
    });
  });
});
