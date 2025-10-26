import { generateTextResponse } from "./aiClient.js";
import { Type } from "@google/genai";
import { generateJSON } from "./aiClient.js";

export const generateResourceDescription = async (
  name: string
): Promise<string> => {
  const prompt = `You are an expert auctioner in a fantasy world. Please provide a very short description of the following item: "${name}". The description should be suitable for an auction house catalog. The response should be in plain text and should not contain any markdown elements`;
  const text = await generateTextResponse(prompt);
  return text;
};

export interface GeneratedList {
  title: string;
  tasks: string[];
  status: "SUCCESS" | "ERROR";
  message: string;
}

export const generateList = async (prompt: string): Promise<GeneratedList> => {
  const schema = {
    type: Type.OBJECT,
    properties: {
      status: { type: Type.STRING, enum: ["SUCCESS", "ERROR"] },
      message: { type: Type.STRING },
      title: { type: Type.STRING },
      tasks: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
      },
    },
    required: ["status", "message", "title", "tasks"],
  };

  const fullPrompt = `
  You are an expert at creating concise to-do lists.
  Main task: Create a concise to-do list (max 20 tasks) for: "${prompt}"
  Instructions:
  - Include two extra fields: 
    • "status": must be "SUCCESS" or "ERROR". 
    • "message": if status="ERROR" explain why (unintelligible or policy violation); 
                 if status="SUCCESS" can be a brief confirmation.
  - If you cannot process the request (unclear or inappropriate), return status="ERROR" and set message to the reason.
  - Otherwise return status="SUCCESS", set message accordingly, and provide:
    {
      "title": "string",
      "tasks": ["task1", "task2", ...]
    }
  Respond only in JSON matching this schema.
  `.trim();

  const response = await generateJSON(fullPrompt, schema);

  // Type guard
  if (
    typeof response !== "object" ||
    (response.status !== "SUCCESS" && response.status !== "ERROR") ||
    typeof response.message !== "string" ||
    typeof response.title !== "string" ||
    !Array.isArray(response.tasks) ||
    !response.tasks.every((t: any) => typeof t === "string")
  ) {
    throw new Error("Invalid AI response structure");
  }

  return response;
};
