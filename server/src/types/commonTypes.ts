import { z } from "zod";

export const MongoIdSchema = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/i, "Invalid MongoDB ID format"),
});
