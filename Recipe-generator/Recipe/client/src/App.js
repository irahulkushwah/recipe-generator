import React, { useState, useEffect, useRef } from "react";
import html2pdf from "html2pdf.js";

function RecipeGenerator() {
  const [darkMode, setDarkMode] = useState(false);
  const [mode, setMode] = useState("ingredients"); // "ingredients" or "name"
  const [recipeName, setRecipeName] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [mealType, setMealType] = useState("Breakfast");
  const [cuisine, setCuisine] = useState("");
  const [cookingTime, setCookingTime] = useState("Less than 30 minutes");
  const [complexity, setComplexity] = useState("Beginner");
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showOutput, setShowOutput] = useState(true); // Keep panel always visible
  const [showContent, setShowContent] = useState(false); // Controls recipe content visibility
  const recipeOutputRef = useRef(null);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Clear recipes and fade out content when mode changes
  useEffect(() => {
    setShowContent(false);
    const timer = setTimeout(() => {
      setRecipes([]);
    }, 300); // Match the fade duration
    return () => clearTimeout(timer);
  }, [mode]);

  const cleanText = (text) => {
    return text.replace(/\*/g, "").trim();
  };

  const removeDuplicates = (arr) => {
    return [...new Set(arr.map((item) => cleanText(item)))];
  };

  const handleSubmitByName = async () => {
    if (!recipeName) {
      setError("Please enter a recipe name.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:5000/api/generate-by-name",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ recipeName }),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      if (data.recipe) {
        const normalizedRecipes = Array.isArray(data.recipe)
          ? data.recipe
          : [data.recipe];
        const processedRecipes = normalizedRecipes.map((recipe) => {
          if (typeof recipe === "string") {
            const sections = {
              title: "",
              ingredients: [],
              equipment: [],
              instructions: [],
              tips: [],
            };
            let currentSection = null;
            const lines = recipe
              .split("\n")
              .map((line) => line.trim().replace(/\r$/, ""));
            lines.forEach((line) => {
              const cleanedLine = cleanText(line);
              if (
                /^\**(.+?)\**$/.test(cleanedLine) &&
                (cleanedLine.toLowerCase().includes("recipe title") ||
                  cleanedLine.toLowerCase().includes("ingredients") ||
                  cleanedLine.toLowerCase().includes("equipment") ||
                  cleanedLine.toLowerCase().includes("instructions") ||
                  cleanedLine.toLowerCase().includes("optional tips") ||
                  cleanedLine.toLowerCase().includes("serving or variations"))
              ) {
                if (cleanedLine.toLowerCase().includes("recipe title"))
                  currentSection = "title";
                else if (cleanedLine.toLowerCase().includes("ingredients"))
                  currentSection = "ingredients";
                else if (cleanedLine.toLowerCase().includes("equipment"))
                  currentSection = "equipment";
                else if (cleanedLine.toLowerCase().includes("instructions"))
                  currentSection = "instructions";
                else if (
                  cleanedLine.toLowerCase().includes("optional tips") ||
                  cleanedLine.toLowerCase().includes("serving or variations")
                )
                  currentSection = "tips";
                else currentSection = null;
              } else if (cleanedLine && currentSection) {
                if (currentSection === "title") {
                  sections.title = cleanedLine;
                } else if (
                  (currentSection === "ingredients" ||
                    currentSection === "equipment" ||
                    currentSection === "tips") &&
                  /^[-•*]/.test(line)
                ) {
                  sections[currentSection].push(
                    cleanedLine.replace(/^[-•*]\s*/, "")
                  );
                } else if (
                  currentSection === "instructions" &&
                  !/^\**(.+?)\**$/.test(cleanedLine)
                ) {
                  sections.instructions.push(cleanedLine);
                }
              }
            });
            return sections;
          }
          return {
            title: recipe.title ? cleanText(recipe.title) : "",
            ingredients: recipe.ingredients
              ? removeDuplicates(recipe.ingredients)
              : [],
            equipment: recipe.equipment
              ? removeDuplicates(recipe.equipment)
              : [],
            instructions: recipe.instructions
              ? cleanText(recipe.instructions)
                  .split("\n")
                  .filter((line) => line.trim())
              : [],
            tips: recipe.tips ? removeDuplicates(recipe.tips) : [],
          };
        });
        setRecipes(processedRecipes);
        setError(null);
        setShowContent(true); // Show content after successful generation
      } else {
        setRecipes([]);
        setShowContent(false);
      }
    } catch (err) {
      console.error("Error generating recipe by name:", err);
      setError(`Failed to generate recipe by name: ${err.message}`);
      setShowContent(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitByIngredients = async () => {
    if (!ingredients) {
      setError("Please enter ingredients.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ingredients,
          mealType,
          cuisine,
          cookingTime,
          complexity,
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      if (data.recipe) {
        const normalizedRecipes = Array.isArray(data.recipe)
          ? data.recipe
          : [data.recipe];
        const processedRecipes = normalizedRecipes.map((recipe) => {
          if (typeof recipe === "string") {
            const sections = {
              title: "",
              ingredients: [],
              equipment: [],
              instructions: [],
              tips: [],
            };
            let currentSection = null;
            const lines = recipe
              .split("\n")
              .map((line) => line.trim().replace(/\r$/, ""));
            lines.forEach((line) => {
              const cleanedLine = cleanText(line);
              if (
                /^\**(.+?)\**$/.test(cleanedLine) &&
                (cleanedLine.toLowerCase().includes("recipe title") ||
                  cleanedLine.toLowerCase().includes("ingredients") ||
                  cleanedLine.toLowerCase().includes("equipment") ||
                  cleanedLine.toLowerCase().includes("instructions") ||
                  cleanedLine.toLowerCase().includes("optional tips") ||
                  cleanedLine.toLowerCase().includes("serving or variations"))
              ) {
                if (cleanedLine.toLowerCase().includes("recipe title"))
                  currentSection = "title";
                else if (cleanedLine.toLowerCase().includes("ingredients"))
                  currentSection = "ingredients";
                else if (cleanedLine.toLowerCase().includes("equipment"))
                  currentSection = "equipment";
                else if (cleanedLine.toLowerCase().includes("instructions"))
                  currentSection = "instructions";
                else if (
                  cleanedLine.toLowerCase().includes("optional tips") ||
                  cleanedLine.toLowerCase().includes("serving or variations")
                )
                  currentSection = "tips";
                else currentSection = null;
              } else if (cleanedLine && currentSection) {
                if (currentSection === "title") {
                  sections.title = cleanedLine;
                } else if (
                  (currentSection === "ingredients" ||
                    currentSection === "equipment" ||
                    currentSection === "tips") &&
                  /^[-•*]/.test(line)
                ) {
                  sections[currentSection].push(
                    cleanedLine.replace(/^[-•*]\s*/, "")
                  );
                } else if (
                  currentSection === "instructions" &&
                  !/^\**(.+?)\**$/.test(cleanedLine)
                ) {
                  sections.instructions.push(cleanedLine);
                }
              }
            });
            return sections;
          }
          return {
            title: recipe.title ? cleanText(recipe.title) : "",
            ingredients: recipe.ingredients
              ? removeDuplicates(recipe.ingredients)
              : [],
            equipment: recipe.equipment
              ? removeDuplicates(recipe.equipment)
              : [],
            instructions: recipe.instructions
              ? cleanText(recipe.instructions)
                  .split("\n")
                  .filter((line) => line.trim())
              : [],
            tips: recipe.tips ? removeDuplicates(recipe.tips) : [],
          };
        });
        setRecipes(processedRecipes);
        setShowContent(true); // Show content after successful generation
      } else {
        setRecipes([]);
        setShowContent(false);
      }
    } catch (err) {
      console.error("Error generating recipe:", err);
      setError(`Failed to generate recipe: ${err.message}`);
      setShowContent(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    setShowContent(false); // Reset content visibility before generating
    if (mode === "name") {
      handleSubmitByName();
    } else {
      handleSubmitByIngredients();
    }
  };

  const handleExportToPDF = () => {
    if (recipes.length === 0) {
      setError("No recipe available to export.");
      return;
    }

    const tempDiv = document.createElement("div");
    tempDiv.className = "pdf-content bg-white text-black p-6";

    const pdfContent = recipes
      .map((recipe, index) => {
        let content = `<div class="recipe-section" style="margin-bottom: 20px;">`;
        if (recipe.title) {
          content += `<h1 style="font-size: 18pt; font-weight: bold; text-align: center; margin-bottom: 10px;">${recipe.title}</h1>`;
        }
        if (recipe.ingredients.length > 0) {
          content += `<h2 style="font-size: 14pt; font-weight: bold; margin-bottom: 5px;">Ingredients</h2>`;
          content += `<ol style="padding-left: 20px; margin-bottom: 10px;">${recipe.ingredients
            .map((ing) => `<li style="margin-bottom: 5px;">${ing}</li>`)
            .join("")}</ol>`;
        }
        if (recipe.equipment.length > 0) {
          content += `<h2 style="font-size: 14pt; font-weight: bold; margin-bottom: 5px;">Equipment</h2>`;
          content += `<ul style="padding-left: 20px; margin-bottom: 10px;">${recipe.equipment
            .map((eq) => `<li style="margin-bottom: 5px;">${eq}</li>`)
            .join("")}</ul>`;
        }
        if (recipe.instructions.length > 0) {
          content += `<h2 style="font-size: 14pt; font-weight: bold; margin-bottom: 5px;">Instructions</h2>`;
          content += `<div style="margin-bottom: 10px;">${recipe.instructions
            .map((step) => `<p style="margin-bottom: 5px;">${step}</p>`)
            .join("")}</div>`;
        }
        if (recipe.tips.length > 0) {
          content += `<h2 style="font-size: 14pt; font-weight: bold; margin-bottom: 5px;">Tips & Variations</h2>`;
          content += `<ol style="padding-left: 20px;">${recipe.tips
            .map((tip) => `<li style="margin-bottom: 5px;">${tip}</li>`)
            .join("")}</ol>`;
        }
        content += `</div>`;
        return content;
      })
      .join("");

    tempDiv.innerHTML = pdfContent;
    document.body.appendChild(tempDiv);

    const options = {
      margin: 10,
      filename: `recipe_${new Date().toISOString().split("T")[0]}.pdf`,
      image: { type: "jpeg", quality: 1.0 },
      html2canvas: { scale: 4, useCORS: true, letterRendering: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    html2pdf()
      .set(options)
      .from(tempDiv)
      .toPdf()
      .get("pdf")
      .then((pdf) => {
        pdf.save();
        document.body.removeChild(tempDiv);
      })
      .catch((err) => {
        console.error("PDF generation error:", err);
        setError("Failed to generate PDF.");
        document.body.removeChild(tempDiv);
      });
  };

  const getYouTubeLink = (recipe) => {
    if (!recipe || !recipe.ingredients || !recipe.ingredients.length) {
      return null;
    }

    const videoLinks = {
      indian: {
        breakfast: {
          "tomato,potato,onion": "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Replace with real ID
          "potato,onion": "https://www.youtube.com/watch?v=example1",
        },
      },
      italian: {
        dinner: {
          "tomato,potato": "https://www.youtube.com/watch?v=example2",
        },
      },
    };

    const lowerIngredients = recipe.ingredients.map((ing) => ing.toLowerCase());
    const cuisineLower = cuisine.toLowerCase();
    const mealTypeLower = mealType.toLowerCase();

    const ingKey = lowerIngredients.sort().join(",");
    const key = `${cuisineLower}.${mealTypeLower}.${ingKey}`;

    if (
      videoLinks[cuisineLower] &&
      videoLinks[cuisineLower][mealTypeLower] &&
      videoLinks[cuisineLower][mealTypeLower][ingKey]
    ) {
      return videoLinks[cuisineLower][mealTypeLower][ingKey];
    }

    if (
      cuisineLower.includes("indian") &&
      mealTypeLower.includes("breakfast") &&
      lowerIngredients.includes("tomato") &&
      lowerIngredients.includes("potato") &&
      lowerIngredients.includes("onion")
    ) {
      return "https://www.youtube.com/watch?v=dQw4w9WgXcQ"; // Replace with real ID
    }

    return null;
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-b ${
        darkMode ? "from-gray-900 to-gray-800" : "from-white to-gray-100"
      } flex items-center justify-center p-4 transition-colors duration-300 overflow-hidden text-gray-800 dark:text-white`}
    >
      <div className="absolute top-4 right-4 flex space-x-2">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="bg-gray-800 dark:bg-white text-white dark:text-black px-4 py-2 rounded shadow hover:opacity-80"
        >
          {darkMode ? "☀️" : "🌙"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-6xl h-[calc(100vh-2rem)]">
        <div className="bg-white dark:bg-gray-700 dark:text-white rounded-xl shadow-[0_10px_20px_rgba(0,0,0,0.3)] p-6 flex flex-col h-full">
          <h2 className="text-xl font-bold text-center mb-6">
            Recipe Generator
          </h2>

          <div className="mb-6 flex justify-center">
            <label className="flex items-center space-x-2 cursor-pointer">
              <span className="text-gray-800 dark:text-white">
                Using What You Have
              </span>
              <input
                type="checkbox"
                checked={mode === "name"}
                onChange={() =>
                  setMode(mode === "ingredients" ? "name" : "ingredients")
                }
                className="toggle-checkbox"
              />
              <span className="toggle-switch"></span>
              <span className="text-gray-800 dark:text-white">By Recipe Title</span>
            </label>
            <style>
              {`
                .toggle-checkbox {
                  display: none;
                }
                .toggle-switch {
                  width: 40px;
                  height: 20px;
                  background-color: #ccc;
                  border-radius: 10px;
                  position: relative;
                  cursor: pointer;
                  transition: background-color 0.3s;
                }
                .toggle-checkbox:checked + .toggle-switch {
                  background-color: #4b9af4;
                }
                .toggle-switch::after {
                  content: '';
                  width: 16px;
                  height: 16px;
                  background-color: white;
                  border-radius: 50%;
                  position: absolute;
                  top: 2px;
                  left: 2px;
                  transition: transform 0.3s;
                }
                .toggle-checkbox:checked + .toggle-switch::after {
                  transform: translateX(20px);
                }
              `}
            </style>
          </div>

          <div className="flex-grow space-y-6 overflow-hidden">
            <div
              className={`transition-all duration-500 ease-in-out transform ${
                mode === "ingredients"
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-full"
              }`}
            >
              {mode === "ingredients" && (
                <>
                  <div className="space-y-4">
                    <div>
                      <label
                        className="block font-semibold mb-1"
                        htmlFor="ingredients"
                      >
                        Ingredients
                      </label>
                      <input
                        id="ingredients"
                        type="text"
                        className="w-full border dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-800 dark:text-white"
                        placeholder="e.g. tomato, potato, onion"
                        value={ingredients}
                        onChange={(e) => setIngredients(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">
                        Meal Type
                      </label>
                      <select
                        className="w-full border dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-800 dark:text-white"
                        value={mealType}
                        onChange={(e) => setMealType(e.target.value)}
                      >
                        <option>Breakfast</option>
                        <option>Lunch</option>
                        <option>Dinner</option>
                        <option>Snack</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block font-semibold mb-1">
                        Cuisine Preference
                      </label>
                      <input
                        type="text"
                        className="w-full border dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-800 dark:text-white"
                        placeholder="e.g. Indian, Italian"
                        value={cuisine}
                        onChange={(e) => setCuisine(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">
                        Cooking Time
                      </label>
                      <select
                        className="w-full border dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-800 dark:text-white"
                        value={cookingTime}
                        onChange={(e) => setCookingTime(e.target.value)}
                      >
                        <option>Less than 30 minutes</option>
                        <option>30-60 minutes</option>
                        <option>More than 1 hour</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">
                      Complexity
                    </label>
                    <select
                      className="w-full border dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-800 dark:text-white"
                      value={complexity}
                      onChange={(e) => setComplexity(e.target.value)}
                    >
                      <option>Beginner</option>
                      <option>Intermediate</option>
                      <option>Advanced</option>
                    </select>
                  </div>
                </>
              )}
            </div>
            <div
              className={`transition-all duration-500 ease-in-out transform ${
                mode === "name"
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-full"
              }`}
            >
              {mode === "name" && (
                <div className="space-y-4">
                  <div>
                    <label
                      className="block font-semibold mb-1"
                      htmlFor="recipeName"
                    >
                      Recipe Name
                    </label>
                    <input
                      id="recipeName"
                      type="text"
                      className="w-full border dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-800 dark:text-white"
                      placeholder="e.g. pizza"
                      value={recipeName}
                      onChange={(e) => setRecipeName(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded w-full mt-6"
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate Recipe"}
          </button>
          {error && (
            <p className="text-red-500 dark:text-red-400 text-center mt-2">
              {error}
            </p>
          )}
        </div>

        {showOutput && (
          <div className="bg-white dark:bg-gray-700 rounded-xl shadow-[0_10px_20px_rgba(0,0,0,0.3)] p-6 flex flex-col h-[calc(100vh-2rem)]">
            <h2 className="text-xl font-bold mb-4 text-center text-gray-800 dark:text-white">
              Recipe Summary
            </h2>

            <div className="flex-grow overflow-y-auto">
              {error && (
                <p className="text-red-500 dark:text-red-400 text-center mb-4">
                  {error}
                </p>
              )}
              {loading && (
                <div className="flex items-center justify-center h-full flex-col">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
                  <p className="mt-4 text-lg text-gray-800 dark:text-white animate-fade">
                    Recipe Loading...
                  </p>
                </div>
              )}
              {recipes.length === 0 && !loading && (
                <p className="text-gray-500 dark:text-gray-300 text-center h-full flex items-center justify-center">
                  "No recipe yet—add ingredients and details to create something
                  delicious!"
                </p>
              )}
              {recipes.length > 0 && showContent && !loading && (
                <div className="transition-opacity duration-300 opacity-100">
                  <div
                    ref={recipeOutputRef}
                    className="space-y-6 animate-fade-in"
                  >
                    {recipes.map((recipe, index) => (
                      <div
                        key={index}
                        className="rounded-xl bg-white dark:bg-gray-800 shadow-md p-4 border dark:border-gray-700 animate-fade-in"
                      >
                        {typeof recipe === "string" ? (
                          <div className="text-sm space-y-2 text-gray-800 dark:text-white">
                            <p>Unable to format recipe properly.</p>
                          </div>
                        ) : (
                          <>
                            {recipe.title && (
                              <h3 className="text-lg font-bold text-center text-gray-800 dark:text-white mb-4 animate-fade-in">
                                {recipe.title}
                              </h3>
                            )}

                            {recipe.ingredients.length > 0 && (
                              <div className="mb-4">
                                <h4 className="text-lg font-bold text-center text-gray-800 dark:text-white mb-2 animate-fade-in">
                                  Ingredients
                                </h4>
                                <ol className="list-decimal list-inside space-y-1 text-gray-800 dark:text-gray-200 text-sm">
                                  {recipe.ingredients.map((ing, i) => (
                                    <li key={i} className="animate-fade-in">
                                      {ing}
                                    </li>
                                  ))}
                                </ol>
                              </div>
                            )}

                            {recipe.equipment.length > 0 && (
                              <div className="mb-4">
                                <h4 className="text-lg font-bold text-center text-gray-800 dark:text-white mb-2 animate-fade-in">
                                  Equipment
                                </h4>
                                <ul className="list-disc list-inside space-y-1 text-gray-800 dark:text-gray-200 text-sm">
                                  {recipe.equipment.map((eq, i) => (
                                    <li key={i} className="animate-fade-in">
                                      {eq}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {recipe.instructions.length > 0 && (
                              <div className="mb-4">
                                <h4 className="text-lg font-bold text-center text-gray-800 dark:text-white mb-2 animate-fade-in">
                                  Instructions
                                </h4>
                                <div className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
                                  {recipe.instructions.map((step, i) => (
                                    <p key={i} className="mb-2 animate-fade-in">
                                      {step}
                                    </p>
                                  ))}
                                </div>
                              </div>
                            )}

                            {recipe.tips.length > 0 && (
                              <div>
                                <h4 className="text-lg font-bold text-center text-gray-800 dark:text-white mb-2 animate-fade-in">
                                  Tips & Variations
                                </h4>
                                <ol className="list-decimal list-inside space-y-1 text-gray-800 dark:text-gray-200 text-sm">
                                  {recipe.tips.map((tip, i) => (
                                    <li key={i} className="animate-fade-in">
                                      {tip}
                                    </li>
                                  ))}
                                </ol>
                              </div>
                            )}

                            {getYouTubeLink(recipe) && (
                              <div className="mt-4">
                                <h4 className="text-lg font-bold text-center text-gray-800 dark:text-white mb-2 animate-fade-in">
                                  Video Tutorial
                                </h4>
                                <a
                                  href={getYouTubeLink(recipe)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-500 hover:underline text-center block"
                                >
                                  Watch Recipe Video
                                </a>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex justify-center">
                    <button
                      onClick={handleExportToPDF}
                      className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-3 rounded text-sm"
                    >
                      Export to PDF
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <style>
        {`
          .panel {
            box-sizing: border-box;
            min-height: 0;
            height: auto;
            display: flex;
            flex-direction: column;
          }
          @keyframes fade {
            0% { opacity: 0.5; }
            50% { opacity: 1; }
            100% { opacity: 0.5; }
          }
          @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .animate-fade {
            animation: fade 1.5s infinite;
          }
          .animate-fade-in {
            animation: fade-in 0.5s ease-out forwards;
          }
          .transition-all {
            transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out;
          }
          .transition-opacity {
            transition: opacity 0.3s ease-in-out;
          }
          .opacity-100 {
            opacity: 1;
          }
          .opacity-0 {
            opacity: 0;
          }
          .translate-x-0 {
            transform: translateX(0);
          }
          .translate-x-full {
            transform: translateX(100%);
          }
          .-translate-x-full {
            transform: translateX(-100%);
          }
        `}
      </style>
    </div>
  );
}

export default RecipeGenerator;
