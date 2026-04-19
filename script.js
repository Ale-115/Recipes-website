"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// HELPER FUNCTIONS
const form = document.querySelector('.recipeForm');
const imgBox = document.querySelector('.imgBox');
const title = document.querySelector('.title');
const details = document.querySelector('.details');
const searchForm = document.querySelector('.searchForm');
const searchInputField = document.getElementById('searchInput');
const resultsList = document.querySelector('.resultsList');
const recipeDetails = document.querySelector('.recipeDetails');
const clearElements = () => {
    title.innerText = "";
    imgBox.innerHTML = "";
    details.innerHTML = "";
};
// RANDOM RECIPE
const getRecipe = () => __awaiter(void 0, void 0, void 0, function* () {
    clearElements();
    try {
        const response = yield fetch('https://www.themealdb.com/api/json/v1/1/random.php');
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const data = yield response.json();
        if (!data.meals) {
            details.innerHTML = "<h4>No recipe found.</h4>";
            return;
        }
        const meal = data.meals[0];
        if (!meal) {
            details.innerHTML = "<h4>No recipe found.</h4>";
            return;
        }
        // Image
        const img = document.createElement('img');
        img.src = meal.strMealThumb;
        img.alt = meal.strMeal;
        imgBox.appendChild(img);
        // Title
        title.textContent = meal.strMeal;
        // Instructions
        const instructions = document.createElement('p');
        instructions.textContent = meal.strInstructions;
        details.appendChild(instructions);
    }
    catch (_a) {
        details.innerHTML = "<h4>Error fetching recipe!</h4>";
    }
});
/// SEARCH RECIPES
const searchRecipes = (query) => __awaiter(void 0, void 0, void 0, function* () {
    resultsList.innerHTML = "<li>Searching...</li>";
    recipeDetails.innerHTML = "";
    try {
        const response = yield fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const data = yield response.json();
        resultsList.innerHTML = "";
        if (!data.meals) {
            resultsList.innerHTML = "<li>No recipes found</li>";
            return;
        }
        data.meals.slice(0, 6).forEach((meal) => {
            const li = document.createElement('li');
            li.classList.add('resultItem');
            li.innerHTML = `
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="resultThumb">
        <p class="resultName">${meal.strMeal}</p>
      `;
            li.setAttribute('role', 'button');
            li.setAttribute('tabindex', '0');
            li.addEventListener('click', () => {
                showSearchRecipe(meal);
            });
            li.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    showSearchRecipe(meal);
                }
            });
            resultsList.appendChild(li);
        });
    }
    catch (_a) {
        resultsList.innerHTML = "<li>Error searching recipes</li>";
    }
});
// SHOW SEARCH RECIPE DETAILS
const showSearchRecipe = (meal) => {
    recipeDetails.innerHTML = "";
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        if (ingredient && ingredient.trim() !== "") {
            const formatted = `${measure ? measure.trim() : ""} ${ingredient.trim()}`.trim();
            ingredients.push(formatted);
        }
    }
    recipeDetails.innerHTML = `
    <h3>${meal.strMeal}</h3>
    <img src="${meal.strMealThumb}" alt="${meal.strMeal}"
         style="width: 100%; max-width: 300px; border-radius: 8px; margin-bottom: 16px;">

    <p><strong>Ingredients:</strong></p>
    <ul>
      ${ingredients.map(item => `<li>${item}</li>`).join('')}
    </ul>
  `;
    recipeDetails.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
};
// EVENT LISTENERS
form.addEventListener('submit', (e) => {
    e.preventDefault();
    getRecipe();
});
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = searchInputField.value.trim();
    if (query === "") {
        resultsList.innerHTML = "<li>Please type a keyword to search for recipes.</li>";
        return;
    }
    searchRecipes(query);
});
