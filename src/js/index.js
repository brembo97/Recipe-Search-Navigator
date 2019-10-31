import Search from './models/Search'
import Recipe from './models/Recipe'
import * as searchView from './views/searchView' 
import {elements, renderLoader, clearLoader} from './views/base'


/**GLOBAL STATE of the app
 * - Seach Object
 * - Current recipe Object 
 * - Ingredient Shopping List Object
 * - Favorite Recipes
 */
const state = {}


/**
 * CONTROL SEARCH
 */
const controlSearch = async () => {
    // 1. Get query from the search bar
    const query = searchView.getInput();
    // 2. Create a new Search and store it on the state
    state.search = new Search(query);
    // 3. Prepare the UI for the results
    searchView.clearInput();
    searchView.clearResults();
    renderLoader(elements.resultsDiv);
    //4. Get the recipes results from the query
    await state.search.getRecipes();
    // 5. Display the recipes on the UI
    clearLoader();
    searchView.renderRecipes(state.search.result);
}

elements.searchBtn.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
})

elements.resultsPages.addEventListener('click', e =>{
    const clickedButton = e.target.closest('.btn-inline');
    if(clickedButton){
        const pageNumber = parseInt(clickedButton.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderRecipes(state.search.result, pageNumber);
    }
 
})

/**
 * CONTROL RECIPE
 */
const recipe = new Recipe(35120);
recipe.getRecipeInfo();
console.log(recipe);

