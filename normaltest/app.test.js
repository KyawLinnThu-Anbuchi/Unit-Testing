import request from "supertest";
import app from "./app";

describe("Get Method", () => {
  // Use done to notify that it ends
  test("Use done", done => {
    request(app)
      .get("/api")
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
  // Jest test will end when it hits the last line of the test function, so you need to use a done() to make it right.

  // Promise way
  test("Promise Way", () => {
    return request(app)
      .get("/api")
      .then(response => {
        expect(response.statusCode).toBe(200);
      });
  });
  // That return is crucial, otherwise your tests will get stuck.
  // No need to pass done to your test.

  // Async, await way to test
  test('The GET / with async', async () => {
    expect.assertions(2);
    const response = await request(app).get('/api');
    expect(response.statusCode).toBe(200);
    const message = JSON.parse(response.text).message;
    expect(message).toBe("Get All")
  });
  // Use async to the function before you want to use await
  // You need the babel-preset-env package to use this.

  // Super Test
  test("Super test", () => {
    return request(app)
      .get("/api")
      .expect(200);
  });
  // Notice that without that return, the test will always pass.

  test("Use done", done => {
    request(app)
      .post("/api")
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});