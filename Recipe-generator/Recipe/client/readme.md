This README includes an overview, setup instructions, usage details, and additional information to help users get started and contribute.

# Recipe Generator

A modern web application that generates recipes based on user preferences (ingredients, meal type, cuisine, cooking time, and complexity) or by recipe name. Built with React for the front-end, Node.js for the back-end, styled with TailwindCSS, and integrated with the Gemini API for recipe generation.

## Features
- **Dual Mode**: Generate recipes by ingredients or by name.
- **Customizable Preferences**: Select meal type, cuisine, cooking time, and complexity.
- **Dark Mode**: Toggle between light and dark themes.
- **Real-Time Generation**: Uses the Gemini API to create detailed recipes with titles, ingredients, equipment, instructions, and tips.
- **Responsive Design**: Optimized for desktop and mobile views.

## Tech Stack
- **Front-End**: React, TailwindCSS
- **Back-End**: Node.js, Express
- **API**: Gemini API (for recipe generation)
- **Dependencies**: Axios (HTTP requests), dotenv (environment variables)

## Prerequisites
- Node.js (v14 or later)
- npm (v6 or later)
- Access to a Gemini API key

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/recipe-generator.git
cd recipe-generator
```

### 2. Set Up the Back-End
- Navigate to the `server` directory:
  ```bash
  cd server
  ```
- Install dependencies:
  ```bash
  npm install
  ```
- Create a `.env` file in the `server` directory and add your Gemini API key:
  ```
  PORT=5000
  GEMINI_API_KEY=your_gemini_api_key_here
  ```
- Start the server:
  ```bash
  node index.js
  ```

### 3. Set Up the Front-End
- Navigate to the `client` directory:
  ```bash
  cd client
  ```
- Install dependencies:
  ```bash
  npm install
  ```
- Start the development server:
  ```bash
  npm start
  ```
- Open your browser and visit `http://localhost:3000`.

## Usage
1. **Select Mode**: Choose between "By Ingredients" or "By Name" using the toggle switch.
2. **Input Preferences**: 
   - For "By Ingredients": Enter ingredients, meal type, cuisine, cooking time, and complexity.
   - For "By Name": Enter the name of the recipe.
3. **Generate Recipe**: Click the "Generate Recipe" button to fetch a recipe.
4. **View Details**: The right panel displays the generated recipe with sections for ingredients, equipment, instructions, and tips.
5. **Toggle Theme**: Use the sun/moon icon in the top-right corner to switch between light and dark modes.

## API Integration
The application uses the Gemini API to generate recipes. Ensure your API key is valid and the endpoint (`https://api.gemini.com/v1/generate`) is correctly configured in the back-end code. The back-end proxies requests to the Gemini API and handles responses.

## Contributing
1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes and commit them (`git commit -m "Add new feature"`).
4. Push to the branch (`git push origin feature-branch`).
5. Open a pull request.

## License
This project is licensed under the [MIT License](LICENSE). Feel free to use, modify, and distribute it.

## Acknowledgments
- Inspired by the need for a customizable recipe generator.
- Built with the help of the xAI community and Grok 3.

## Contact
For questions or support, please open an issue on the [GitHub repository](https://github.com/your-username/recipe-generator/issues) or contact [your-email@example.com](mailto:your-email@example.com).

---

*Note*: Replace `your-username`, `https://github.com/your-username/recipe-generator.git`, and `your-email@example.com` with your actual GitHub username, repository URL, and email address. If you don’t have a GitHub repository yet, you can set one up and update the links accordingly.
```

---

### Notes
- The README assumes your project is hosted on GitHub. If it’s not, you can omit the repository-related sections or adjust them.
- It includes setup instructions for both the front-end and back-end, reflecting your project’s structure.
- The license section mentions MIT as an example; replace it with your preferred license or remove it if unlicensed.
- Feel free to expand the "Acknowledgments" or "Contributing" sections with more details if needed.

