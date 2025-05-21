import express, { Express } from "express";
import cors from "cors";
import logger from "morgan";
import cookieParser from "cookie-parser";
import projectsRouter from "./routes/projects";

const app: Express = express();

// Setup middleware
app.use(cors());
app.use(logger("dev"));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Setup routes
app.use("/api/projects", projectsRouter);

export default app;
