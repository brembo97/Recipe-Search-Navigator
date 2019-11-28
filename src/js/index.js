import Search from './models/Search'
import Recipe from './models/Recipe'
import List from './models/List'
import Like from './models/Like'
import * as searchView from './views/searchView' 
import * as recipeView from './views/recipeView'
import * as listView from './views/listView'
import * as likeView from './views/likeView'
import {elements, renderLoader, clearLoader} from './views/base'


/**GLOBAL STATE of the app
 * - Search Object
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
        //Prepare the UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);
        if(state.search) searchView.highlightSelectedRecipe(id);

        // Store new Recipe in state
        state.recipe = new Recipe(id);

        try{
            // Fetch the Recipe and render it
            await state.recipe.getRecipeInfo();
            state.recipe.parseIngredients();
            // Calculate servings and time
            state.recipe.calcPrepTime();
            state.recipe.calcServings();
            
            //Render the results in UI
            clearLoader();
            recipeView.renderRecipeInfo(state.recipe, state.likes.isLiked(id));
        }catch(err){
            alert(err);
        }
    }
 }

 //Attaching two event triggers to the same element 
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

/**
 * CONTROL LIST
 */
const controlList = () =>{
    //Add empty list to state
    state.shoppingList = new List();
    window.l = state.shoppingList;
    //Fill the list
    state.recipe.ingredients.forEach(item => {
        const newItem = state.shoppingList.addItem(item.amount, item.unit, item.name);
        listView.renderList(newItem);
    });
    //Prepare UI and render results
    listView.clearList();
    state.shoppingList.list.forEach(item => {
        listView.renderList(item);
    })
}

//Deleting items and updating amounts
elements.shoppingList.addEventListener('click', e => {
    const clickedItem = e.target;
    const parentElement = clickedItem.closest('.shopping__item');
    //Delete item
    if(clickedItem.matches('.shopping__delete, .shopping__delete *')){
        //Delete from state
        state.shoppingList.deleteItem(parentElement.dataset.itemid);
        //Delete from UI
        listView.clearListItem(parentElement.dataset.itemid);
    //Update item amount
    } else if(clickedItem.matches('.shopping__count input')){
        state.shoppingList.updateItem(parentElement.dataset.itemid, parseFloat(clickedItem.value,10));
    }
});

/**
 * CONTROL LIKE
 */
const controlLike = () => {
    if(!state.likes) state.likes = new Like();
    const currentId = state.recipe.id;
    
    // Adding a recipe to favorites
    if(!state.likes.isLiked(currentId)){
        //Add recipe to likes model
        const newLike = state.likes.addLike(
            currentId,
            state.recipe.title,
            state.recipe.publisher,
            state.recipe.image
            );
        //Render the recipe to the UI
        likeView.renderLikedItem(newLike);
        //Toggle the heart symbol
        likeView.toggleLikeIcon(false);
    //Removing a recipe from favorites
    }else if(state.likes.isLiked(currentId)){
        //Delete the recipe from the model
        state.likes.deleteLike(currentId);
        //Remove the recipe from the UI
        likeView.removeLikedItem(currentId);
        //Toggle the heart symbol
        likeView.toggleLikeIcon(true);
    }
    //Update local storage and check to toggle the menu
    state.likes.persistData();
    likeView.toggleLikeMenu(state.likes.numberOfLikes());
}

//Update the likes list on page refresh 
window.addEventListener('load', () => {
    state.likes = new Like();
    state.likes.retrieveData();
    likeView.toggleLikeMenu(state.likes.numberOfLikes());
    state.likes.listOfLikes.forEach(like => likeView.renderLikedItem(like));
})

//Event handling for the recipe panel
elements.recipe.addEventListener('click', e => {
    //Change servings event listener
    if(e.target.matches('.btn-decrease, .btn-decrease *')){
        if(state.recipe.servings > 1)
            state.recipe.updateServings('decr');
            recipeView.updateServingsDisplay(state.recipe);
    }else if(e.target.matches('.btn-increase, .btn-increase *')){
        state.recipe.updateServings('incr');
        recipeView.updateServingsDisplay(state.recipe);
    }
    //Call control list logic
    else if(e.target.matches('.recipe__btn-add, .recipe__btn-add *')){
        controlList();
    }
    //Call control like logic
    else if(e.target.matches('.recipe__love, .recipe__love *')){
        controlLike();
    }
});