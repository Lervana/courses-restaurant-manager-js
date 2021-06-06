import { callApi } from "../helpers.js";

const PATH = `api/public/status`;

test(`[GET] ${PATH} - valid request - should return status 200`, async () => {
  const response = await callApi("get", "/status", {}, {}, true);
  expect(response.status).toEqual(200);
  expect(response.data?.status).toEqual("OK");
});
