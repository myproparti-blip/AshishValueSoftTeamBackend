import express from "express";
import axios from "axios";

const router = express.Router();

router.get("/free-stream-ai", async (req, res) => {
  const { prompt } = req.query;

  if (!prompt) {
    return res.status(400).json({ message: "Prompt is required" });
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    // Using Groq Free API - No credit card required
    const groqApiKey = process.env.GROQ_API_KEY;
    
    console.log("🔍 Checking GROQ_API_KEY...");
    console.log("✅ GROQ_API_KEY exists:", !!groqApiKey);
    if (groqApiKey) {
      console.log("✅ Key starts with:", groqApiKey.substring(0, 10) + "...");
      console.log("✅ Key length:", groqApiKey.length);
    }
    
    if (!groqApiKey) {
      console.error("❌ GROQ_API_KEY not configured");
      res.write(`data: ERROR - ${JSON.stringify({ message: "Groq API key not configured. Set GROQ_API_KEY in .env.development" })}\n\n`);
      res.end();
      return;
    }
    
    const response = await axios({
      url: "https://api.groq.com/openai/v1/chat/completions",
      method: "POST",
      responseType: "stream",
      headers: {
        "Authorization": `Bearer ${groqApiKey}`,
        "Content-Type": "application/json"
      },
      data: {
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompt }],
        stream: true,
        max_tokens: 500,
        temperature: 0.7
      },
      timeout: 30000
    });

    response.data.on("data", (chunk) => {
      const text = chunk.toString();
      if (text.trim()) {
        try {
          // Groq uses SSE format: data: {...json...}
          const lines = text.split('\n').filter(line => line.trim());
          lines.forEach(line => {
            if (line.startsWith('data: ')) {
              const jsonStr = line.slice(6); // Remove "data: " prefix
              
              if (jsonStr === '[DONE]') {
                return; // Stream complete marker
              }
              
              try {
                const parsed = JSON.parse(jsonStr);
                if (parsed.choices && parsed.choices[0]?.delta?.content) {
                  const token = parsed.choices[0].delta.content;
                  res.write(`data: ${token}\n\n`);
                }
              } catch (e) {
                console.error("Parse error on line:", jsonStr.slice(0, 100));
              }
            }
          });
        } catch (e) {
          console.error("Stream parse error:", e.message);
        }
      }
    });

    response.data.on("end", () => {
      res.write("data: [END]\n\n");
      res.end();
    });

    response.data.on("error", (err) => {
      console.error("Stream error:", err.message || err);
      res.write(`data: ERROR - ${JSON.stringify({ message: err.message })}\n\n`);
      res.end();
    });

  } catch (err) {
    console.error("DeepSeek API error:", err.response?.data || err.message);
    const errorResponse = {
      message: err.message || "Unknown error",
      status: err.response?.status || "Unknown"
    };
    
    // Safely extract data if it exists
    if (err.response?.data) {
      try {
        errorResponse.data = typeof err.response.data === 'string' 
          ? err.response.data 
          : JSON.stringify(err.response.data);
      } catch (e) {
        errorResponse.data = "Unable to parse error data";
      }
    }
    
    res.write(`data: ERROR - ${JSON.stringify(errorResponse)}\n\n`);
    res.end();
  }
});
export default router;
