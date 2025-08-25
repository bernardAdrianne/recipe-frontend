import serverless from "serverless-http";
import app from "../server.js";  // your main Express app

export const handler = serverless(app);
