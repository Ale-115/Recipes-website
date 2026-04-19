interface Meal {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strInstructions: string;
  [key: string]: string | null;
}

interface MealResponse {
  meals: Meal[] | null;
}


// HELPER FUNCTIONS
const form = document.querySelector('.recipeForm') as HTMLFormElement;
const imgBox = document.querySelector('.imgBox') as HTMLDivElement;
const title = document.querySelector('.title') as HTMLHeadingElement;
const details = document.querySelector('.details') as HTMLDivElement;

const searchForm = document.querySelector('.searchForm') as HTMLFormElement;
const searchInputField = document.getElementById('searchInput') as HTMLInputElement;
const resultsList = document.querySelector('.resultsList') as HTMLUListElement;
const recipeDetails = document.querySelector('.recipeDetails') as HTMLDivElement;


const clearElements = () => {
  title.innerText = "";
  imgBox.innerHTML = "";
  details.innerHTML = "";
};

// RANDOM RECIPE

const getRecipe = async (): Promise<void> => {
  clearElements();

  try {
    const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data: MealResponse = await response.json();

    if (!data.meals) {
      details.innerHTML = "<h4>No recipe found.</h4>";
      return;
    }

    const meal: Meal | undefined = data.meals[0];

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

  } catch {
    details.innerHTML = "<h4>Error fetching recipe!</h4>";
  }
};


/// SEARCH RECIPES

const searchRecipes = async (query: string): Promise<void> => {
  resultsList.innerHTML = "<li>Searching...</li>";
  recipeDetails.innerHTML = "";

  try {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data: MealResponse = await response.json();

    resultsList.innerHTML = "";

    if (!data.meals) {
      resultsList.innerHTML = "<li>No recipes found</li>";
      return;
    }

    data.meals.slice(0, 6).forEach((meal: Meal) => {
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

      li.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          showSearchRecipe(meal);
        }
      });

      resultsList.appendChild(li);
    });

  } catch {
    resultsList.innerHTML = "<li>Error searching recipes</li>";
  }
};

// SHOW SEARCH RECIPE DETAILS

const showSearchRecipe = (meal: Meal): void => {
  recipeDetails.innerHTML = "";

  const ingredients: string[] = [];

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

form.addEventListener('submit', (e: Event) => {
  e.preventDefault();
  getRecipe();
});

searchForm.addEventListener('submit', (e: Event) => {
  e.preventDefault();

  const query: string = searchInputField.value.trim();

  if (query === "") {
    resultsList.innerHTML = "<li>Please type a keyword to search for recipes.</li>";
    return;
  }

  searchRecipes(query);
});