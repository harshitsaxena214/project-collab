import express from "express";
import healthcheckRouter from "./routes/healthcheckRoutes.js";

const app = express();

app.use("/api/v1/healthcheck", healthcheckRouter);

export default app;
