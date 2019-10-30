import {elements} from './base'

export const getInput = () => {
    const input = elements.searchField.value;
    return input;
}

export const clearInput = () => {
    elements.searchField.value = '';
}

export const clearResults = () => {
    elements.resultsList.innerHTML = '';
}

const limitRecipeTitle = (title, limit = 17) => {
    if(title.length > limit){
        const newTitle = [];
        title.split(' ').reduce((acc, curr)=>{
            if(acc + curr.length <= limit){
                newTitle.push(curr);
            }
            return acc + curr.length;
        },0)
        return `${newTitle.join(' ')}...`;
    }
    return title;
}

const renderRecipe = recipe => {
    const markup = `
    <li>
        <a class="results__link results__link--active" href="#${recipe.recipe_id}">
            <figure class="results__fig">
                <img src="${recipe.image_url}" alt="${limitRecipeTitle(recipe.title)}">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
    </li>`
    elements.resultsList.insertAdjacentHTML('beforeend',markup);
}

export const renderRecipes = recipes => {
    recipes.forEach(renderRecipe);
}