import { getStatus } from "./status.js";

export default [
  {
    method: "GET",
    path: "/status",
    isPublic: true,
    cbs: [getStatus],
  },
];
