import axios from "axios";
import https from "https";
import config from "config";

const agent = new https.Agent({
  rejectUnauthorized: false,
});

export const getAppUrl = (uri, isPublic, env) => {
  switch (env) {
    //TODO add other envs
    default:
      return `https://localhost:${config.options.port}${
        isPublic
          ? config.options.public_routes_prefix
          : config.options.private_routes_prefix
      }${uri}`;
  }
};

export const callApi = async (method, uri, body, options, isPublic, env) => {
  const url = getAppUrl(uri, isPublic, env);
  const conf = { ...options, httpsAgent: agent };

  switch (method) {
    case "post":
      return axios.post(url, body, conf);
    case "put":
      return axios.put(url, body, conf);
    case "patch":
      return axios.patch(url, body, conf);
    case "delete":
      return axios.delete(url, conf);
    default:
      return await axios.get(url, conf);
  }
};
