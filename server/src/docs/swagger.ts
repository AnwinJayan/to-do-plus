import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import { Express } from "express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Documentation",
      version: "1.0.0",
    },
  },
  apis: [
    "./src/routes/listRoutes.ts",
    "./src/routes/taskRoutes.ts",
    "./src/types/*.ts",
  ], // Adjust path to your route files
};

const swaggerSpec = swaggerJSDoc(options);

export default function swaggerDocs(app: Express): void {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
