// main.js

// CONSTANTS
const RECIPE_URLS = [
  'https://introweb.tech/assets/json/1_50-thanksgiving-side-dishes.json',
  'https://introweb.tech/assets/json/2_roasting-turkey-breast-with-stuffing.json',
  'https://introweb.tech/assets/json/3_moms-cornbread-stuffing.json',
  'https://introweb.tech/assets/json/4_50-indulgent-thanksgiving-side-dishes-for-any-holiday-gathering.json',
  'https://introweb.tech/assets/json/5_healthy-thanksgiving-recipe-crockpot-turkey-breast.json',
  'https://introweb.tech/assets/json/6_one-pot-thanksgiving-dinner.json',
];

// Run the init() function when the page has loaded
window.addEventListener('DOMContentLoaded', init);

// Starts the program, all function calls trace back here
async function init() {
  // initialize ServiceWorker
  initializeServiceWorker();
  // Get the recipes from localStorage
  let recipes;
  try {
    recipes = await getRecipes();
  } catch (err) {
    console.error(err);
  }
  // Add each recipe to the <main> element
  addRecipesToDocument(recipes);
}

/**
 * Detects if there's a service worker, then loads it and begins the process
 * of installing it and getting it running
 */
function initializeServiceWorker() {
  // EXPLORE - START (All explore numbers start with B)
  /*******************/

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", (event) => {
      try {
        navigator.serviceWorker.register("./sw.js");
        console.log("Service Worker: ./sw.js was registered successfully");
      }
      catch (error){
        console.error(`Registration failed with ${error}`);
      }
    });
  }
}

/**
 * Reads 'recipes' from localStorage and returns an array of
 * all of the recipes found (parsed, not in string form). If
 * nothing is found in localStorage, network requests are made to all
 * of the URLs in RECIPE_URLs, an array is made from those recipes, that
 * array is saved to localStorage, and then the array is returned.
 * @returns {Array<Object>} An array of recipes found in localStorage
 */
async function getRecipes() {
  const localRecipes = localStorage.getItem("recipes");
  if (localRecipes != null){
    return JSON.parse(localRecipes);
  }
  const remoteRecipes = [];
  return new Promise(async (resolve, reject) => {
      for (let i = 0; i < RECIPE_URLS.length; i += 1){
        try {
          const url = await fetch(RECIPE_URLS[i]);
          const recipe = await url.json();
          //console.log(JSON.stringify(recipe));
          remoteRecipes.push(recipe);
        }
        catch (error){
          console.error(error);
        }
      }
      try{
        saveRecipesToStorage(remoteRecipes);
        resolve(remoteRecipes);
      }
      catch (error){
        reject(error);
      }
    })
}
/**
 * Takes in an array of recipes, converts it to a string, and then
 * saves that string to 'recipes' in localStorage
 * @param {Array<Object>} recipes An array of recipes
 */
function saveRecipesToStorage(recipes) {
  localStorage.setItem('recipes', JSON.stringify(recipes));
}

/**
 * Takes in an array of recipes and for each recipe creates a
 * new <recipe-card> element, adds the recipe data to that card
 * using element.data = {...}, and then appends that new recipe
 * to <main>
 * @param {Array<Object>} recipes An array of recipes
 */
function addRecipesToDocument(recipes) {
  if (!recipes) return;
  let main = document.querySelector('main');
  recipes.forEach((recipe) => {
    let recipeCard = document.createElement('recipe-card');
    recipeCard.data = recipe;
    main.append(recipeCard);
  });
}
