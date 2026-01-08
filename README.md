# recipe-generator

🍳 AI-Based Recipe Generator Using Gemini API

An intelligent full-stack web application that generates **personalized cooking recipes** in real-time using **Google’s Gemini generative AI model**.

This project helps users answer two everyday cooking questions:

- What can I cook with what I have?
- How do I cook a dish I want to try?

Built for students, working professionals, food enthusiasts, and anyone looking for quick culinary inspiration.

---

🚀 Features

🔹 Dual Input Modes
- Ingredients Mode: Enter ingredients you already have.
- Dish Name Mode: Enter a specific dish you want to cook.

🔹 Optional Filter Controls
Refine results using:
- Meal Type: `Breakfast | Lunch | Dinner | Snack | Dessert`
- Cuisine: `Indian | Italian | Chinese | Mexican`
- Cooking Time: `Under 30 mins | 30–60 mins`
- Complexity: `Beginner | Intermediate | Advanced`

🔹 Intelligent AI Output
The Gemini API returns:
- Recipe title(s)
- Ingredient list
- Step-by-step instructions
- Additional tips & substitutions (when applicable)

🔹 UI/UX Features
- Fully responsive design
- Light/Dark mode support
- Clean & readable output panel

---

🧠 Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | React.js, Tailwind CSS |
| **Backend** | Node.js |
| **AI Model** | Google Gemini API via `@google/generative-ai` |
| **Package Manager** | npm |

---

🏗️ Architecture Overview

The application flow works as follows:

1. User selects input mode (Ingredients / Dish Name)
2. User optionally applies filters
3. Backend constructs prompt dynamically
4. Backend sends request to Gemini API
5. AI returns recipe details
6. Frontend displays formatted results

This design ensures adaptability, clean separation of concerns, and scalable prompt construction.

---

📦 Installation & Setup

1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/recipe-generator.git
cd recipe-generator
