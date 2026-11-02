
const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Connect EDITH to Ollama
app.post("/api/ask", async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt || typeof prompt !== "string") {
            return res.status(400).json({
                error: "Please enter a question."
            });
        }

        const response = await fetch("http://localhost:11434/api/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "qwen2.5-coder:1.5b",
                prompt: prompt,
                format: "json",
                stream: false,
                options: {
                    temperature: 0.1
                }
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText);
        }

        const data = await response.json();

        if (!data.response) {
            throw new Error("Ollama returned an empty response.");
        }

        res.json({
            answer: data.response
        });

    } catch (error) {
        console.error("EDITH AI Error:", error);

        res.status(500).json({
            error: "AI connection failed: " + error.message
        });
    }
});

// Serve EDITH website files
app.use(express.static(path.join(__dirname, "..")));

app.listen(PORT, () => {
    console.log(`EDITH AI server running at http://localhost:${PORT}`);
});
