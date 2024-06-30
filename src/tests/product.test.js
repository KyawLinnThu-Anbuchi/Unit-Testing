import supertest from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import createServer from "../utils/server.js";
import mongoose from "mongoose";
import { createProduct } from "../services/product.service.js";

const app = createServer();

export const productPayload = {
  title: "Title",
  description: "Description"
};

export const updateProductPayload = {
  title: "Title Edit",
  description: "Description"
}

describe("product", () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();
    mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  describe("Products API", () => {
    // Create
    describe("Create products route", () => {
      test("should return a 200 and create the product", async () => {
        const { statusCode, body } = await supertest(app)
          .post("/api/products")
          .send(productPayload);
  
        expect(statusCode).toBe(200);
  
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

    // Read
    describe("given the product does not exist", () => {
      test("should return a 404", async () => {
        const productId = "product-123";
        await supertest(app).get(`/api/products/${productId}`).expect(404);
      });
    });

    // Read
    describe("given the product does exist", () => {
      test("should return a 200 status and get all products", async () => {
        // Create a product
        var { statusCode: postStatusCode } = await supertest(app)
          .post("/api/products")
          .send(productPayload);
        expect(postStatusCode).toBe(200);
      
        // Get all products
        var { body, statusCode: getStatusCode } = await supertest(app)
          .get("/api/products");
      
        expect(getStatusCode).toBe(200);
      
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
      

      test("should return a 200 status and get one product", async () => {
        const product = await createProduct(productPayload);
        const { body, statusCode } = await supertest(app).get(
          `/api/products/${product.productId}`
        );

        expect(statusCode).toBe(200);
        expect(body.productId).toBe(product.productId);
      });
    });
  });

  // Update
  describe("Update products route", () => {
    test("Update", async() => {
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
    })

    test("Update non-existent product should return 404", async () => {
      // Use a random productId that does not exist in the database
      const nonExistentProductId = "nonExistentProductId";
  
      // Attempt to update a non-existent product
      const { statusCode, body } = await supertest(app)
        .put(`/api/products/${nonExistentProductId}`)
        .send(updateProductPayload);
  
      // Check for 404 status code
      expect(statusCode).toBe(404);
      expect(body).toEqual({
        message: "Product not found", // Adjust the message based on your API's response
      });
    });
  });

  // Delete
  describe("Delete products route", () => {
    test("Update non-existent product should return 404", async () => {
      // Use a random productId that does not exist in the database
      const nonExistentProductId = "nonExistentProductId";
      const { statusCode, body } = await supertest(app).delete(`/api/products/${nonExistentProductId}`);
      // Check for 404 status code
      expect(statusCode).toBe(404);
      expect(body).toEqual({
        message: "Product not found", // Adjust the message based on your API's response
      });
    });

    test("should return a 200 status and delete one product", async () => {
      const product = await createProduct(productPayload);
      const { statusCode } = await supertest(app).delete(
        `/api/products/${product.productId}`
      );
      expect(statusCode).toBe(200);
    });
  });
});
