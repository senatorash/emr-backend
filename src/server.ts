import http from "http";
import app from "./app";
import envVariables from "./config/index";
import connectDB from "./helpers/db";

const httpServer = http.createServer(app);
const { PORT } = envVariables;
const startServer = async () => {
  await connectDB();
  httpServer.listen(PORT, () => {
    console.log(`Server is runnning on port: ${PORT}`);
  });
};
startServer();
