import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();

app.use(cors({
  origin: "*",
  methods: ["POST", "GET"]
}));

app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/chat", async (req, res) => {
  const { messages } = req.body;
  
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: messages,
      max_tokens: 1000,
    });

    const formattedResponse = {
      id: response.id,
      created: response.created,
      model: response.model,
      choices: [{
        message: {
          role: "assistant",
          content: response.choices[0].message.content
        },
        finish_reason: response.choices[0].finish_reason
      }],
      usage: response.usage
    };

    res.json(formattedResponse);
    
  } catch (error) {
    console.error("Erro ao chamar OpenAI:", error);
    
    let errorMessage = "Internal server error";
    let statusCode = 500;
    
    if (error instanceof OpenAI.APIError) {
      errorMessage = `OpenAI Error [${error.status}]: ${error.message}`;
      statusCode = error.status || 500;
    }
    
    res.status(statusCode).json({ error: errorMessage });
  }
});

app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});