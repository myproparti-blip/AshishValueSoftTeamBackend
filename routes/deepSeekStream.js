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
    const response = await axios({
      url: "https://api.deepseek.com/v1/chat/completions",
      method: "POST",
      responseType: "stream",
      headers: {
        "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        "Content-Type": "application/json"
      },
      data: {
        model: "deepseek-chat",
        stream: true,
        messages: [{ role: "user", content: prompt }]
      }
    });

    response.data.on("data", (chunk) => {
      const text = chunk.toString();
      if (text.trim()) {
        res.write(`data: ${text}\n\n`);
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
    res.write(
      `data: ERROR - ${JSON.stringify({
        message: err.message,
        status: err.response?.status,
        data: err.response?.data
      })}\n\n`
    );
    res.end();
  }
});
export default router;
