// External Imports
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { clerkMiddleware } from "@clerk/express";
import "express-async-errors";

// @ts-ignore: No types available
import mongoSanitize from "express-mongo-sanitize";
// @ts-ignore: No types available
import xssClean from "xss-clean";
import cookieParser from "cookie-parser";

// Internal Imports
import config from "./config/index.js";
import errorHandlerMiddleware from "./middlewares/errorHandler.js";
import notFoundMiddleware from "./middlewares/notFound.js";
import authenticateUser from "./middlewares/authenticateUser.js";
import restrictSuspendedUsers from "./middlewares/restrictSuspendedUsers.js";
// ...existing code...
import listRouter from "./routes/listRoutes";
import taskRouter from "./routes/taskRoutes";
import uploadRouter from "./routes/uploadRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import swaggerDocs from "./docs/swagger.js";

const app = express();

// Security Middleware
app.use(helmet());
app.use(mongoSanitize());
app.use(xssClean());

// Logging
app.use(morgan("dev"));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: "Too many requests from this IP, please try again after an hour",
  statusCode: 429,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// JSON Parser & CORS
app.use(express.json());
app.use(express.json());
app.use(
  cors({
    origin: config.frontendUrl,
    credentials: true,
  })
);
app.use(cookieParser());

// Swagger
swaggerDocs(app);
app.use(clerkMiddleware());

// Routes
const apiRouter = express.Router();

// ...existing code...
apiRouter.use("/lists", listRouter);
apiRouter.use("/tasks", taskRouter);
apiRouter.use("/upload", uploadRouter);
apiRouter.use("/admin", authenticateUser, restrictSuspendedUsers, adminRouter);
apiRouter.use("/auth", authRouter);
apiRouter.use("/users", authenticateUser, userRouter);

app.use("/api/v1", apiRouter);

app.get("/", (req, res) => {
  res.status(200).json({ message: "The server is up and running!" });
});

// Error Handling
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

export default app;
