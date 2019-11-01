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
    try{
        await state.search.getRecipes();
    }catch(err){
        console.log(err);
        clearLoader();
    }
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
 const controlRecipe = async () => {
    //Get URL id
    const id = window.location.hash.replace('#', '');

    if(id){
        // Store new Recipe in state
        state.recipe = new Recipe(id);
        //Prepare the UI
    
        try{
            // Fetch the Recipe info
            await state.recipe.getRecipeInfo();
            // Calculate servings and time
            state.recipe.calcPrepTime();
            state.recipe.calcServings();
            //Render the results in UI
            console.log(state.recipe);
        }catch(err){
            alert(err);
        }
    }
 }

 //Attaching two event triggers to the same element 
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));