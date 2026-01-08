import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Load environment variables from .env
dotenv.config();

console.log("Loaded GEMINI_API_KEY:", process.env.GEMINI_API_KEY); // Debug log

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/api/generate-by-name", async (req, res) => {
  try {
    const { recipeName } = req.body;
    if (!recipeName) {
      return res.status(400).json({ error: "Recipe name is required." });
    }
    console.log("Received recipeName:", recipeName);
    const prompt = `You are a professional chef. Create a detailed recipe for ${recipeName}. Please provide: - A recipe title - Ingredients list (with bullet points or dashes) - Step-by-step instructions - Optional tips for serving or variations`;
    console.log("Generating recipe with prompt:", prompt);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const recipeText = response.text().trim();
    console.log("Raw recipe text:", recipeText);

    const lines = recipeText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
    let title = "Recipe for " + recipeName;
    let ingredients = [];
    let instructions = [];
    let tips = [];
    let currentSection = null;

    lines.forEach((line) => {
      if (line.startsWith("**") && line.endsWith("**")) {
        const section = line.replace(/\*\*/g, "").toLowerCase().trim();
        console.log("Detected section:", section);
        if (section.includes("recipe title")) currentSection = "title";
        else if (section.includes("ingredients"))
          currentSection = "ingredients";
        else if (section.includes("instructions"))
          currentSection = "instructions";
        else if (section.includes("tips") || section.includes("variations"))
          currentSection = "tips";
        else currentSection = null;
      } else if (currentSection) {
        console.log("Processing line under", currentSection, ":", line);
        if (currentSection === "title" && !title.includes(recipeName))
          title = line;
        else if (currentSection === "ingredients" && /^[-•]\s/.test(line))
          ingredients.push(line.replace(/^[-•]\s*/, "").trim());
        else if (currentSection === "instructions" && !line.startsWith("**"))
          instructions.push(line);
        else if (currentSection === "tips" && /^[-•]\s/.test(line))
          tips.push(line.replace(/^[-•]\s*/, "").trim());
      } else if (!currentSection && /^\d+\.\s/.test(line)) {
        // Fallback: Treat numbered lines as instructions if no section is active
        instructions.push(line);
      }
    });

    console.log(
      "Parsed sections - Title:",
      title,
      "Ingredients:",
      ingredients,
      "Instructions:",
      instructions,
      "Tips:",
      tips
    );
    if (instructions.length === 0) {
      throw new Error("No instructions found in recipe structure");
    }

    res.json({
      recipe: {
        title,
        ingredients: ingredients.length > 0 ? ingredients : [],
        instructions: instructions.join("\n"),
        tips: tips.length > 0 ? tips : undefined,
      },
    });
  } catch (error) {
    console.error("Error in /api/generate-by-name:", error.message || error);
    res
      .status(500)
      .json({ error: "Failed to generate recipe by name: " + error.message });
  }
});

app.post("/api/generate", async (req, res) => {
  try {
    const { ingredients, mealType, cuisine, cookingTime, complexity } =
      req.body;
    if (!ingredients) {
      return res.status(400).json({ error: "Ingredients are required." });
    }
    const prompt = `You are a professional chef. Create a detailed recipe using the following ingredients: ${ingredients}. Additional preferences: meal type - ${mealType}, cuisine - ${
      cuisine || "any"
    }, cooking time - ${cookingTime}, complexity - ${complexity}. Please provide: - A recipe title - Ingredients list (with bullet points or dashes) - Step-by-step instructions - Optional tips for serving or variations`;
    console.log("Generating recipe with prompt:", prompt);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const recipeText = response.text().trim();
    console.log("Raw recipe text:", recipeText);

    const lines = recipeText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
    let title =
      lines[0].replace(/^#+\s*/, "").trim() || `Recipe with ${ingredients}`;
    const ingredientsStart = lines.findIndex((line) =>
      /ingredients/i.test(line)
    );
    const instructionsStart = lines.findIndex((line) =>
      /instructions/i.test(line)
    );
    if (ingredientsStart === -1 || instructionsStart === -1) {
      throw new Error("Unable to parse recipe structure");
    }
    const ingredientsList = lines
      .slice(ingredientsStart + 1, instructionsStart)
      .filter((line) => line && !/^\s*$/.test(line))
      .map((line) => line.replace(/^[-*]\s*/, "").trim());
    const instructionsText = lines
      .slice(instructionsStart + 1)
      .join("\n")
      .trim();
    const tipsIndex = lines.findIndex((line) => /tips|variations/i.test(line));
    let tips = [];
    if (tipsIndex !== -1) {
      tips = lines
        .slice(tipsIndex + 1)
        .filter((line) => line && /^[-*]\s/.test(line))
        .map((line) => line.replace(/^[-*]\s*/, "").trim());
    }

    res.json({
      recipe: {
        title,
        ingredients: ingredientsList,
        instructions: instructionsText,
        tips: tips.length > 0 ? tips : undefined,
      },
    });
  } catch (error) {
    console.error("Error in /api/generate:", error.message || error);
    res
      .status(500)
      .json({ error: "Failed to generate recipe: " + error.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});
