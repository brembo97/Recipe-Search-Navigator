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
    elements.resultsPages.innerHTML = '';
}

export const highlightSelectedRecipe = id => {
    //remove active class from all recipes
    const recipes = Array.from(document.querySelectorAll('a.results__link'));
    recipes.forEach( el => el.classList.remove("results__link--active"));
    //add active class on clicked recipe
    document.querySelector(`a.results__link[href="#${id}"]`).classList.add("results__link--active");
}

export const renderRecipes = (recipes, page = 1, resultsPerPage = 10) => {
    //render the results
    const start = (page - 1) * resultsPerPage;
    const end = page * resultsPerPage;
    recipes.slice(start, end).forEach(renderRecipe);
    //render pagination buttons
    renderPaginationButtons(page, recipes.length, resultsPerPage);
}

const renderRecipe = recipe => {
    const markup = `
    <li>
        <a class="results__link" href="#${recipe.recipe_id}">
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

const renderPaginationButtons = (page, numberOfResults, resultsPerPage) => {
    const pages = Math.ceil(numberOfResults/resultsPerPage);
    let buttons;
    if(page === 1 && pages > 1){
        buttons = createButtons(page, 'next');
    }else if (page < pages){
        buttons = `
        ${createButtons(page, 'prev')}
        ${createButtons(page, 'next')}
        `
    }else if(page === pages && pages > 1){
        buttons = createButtons(page, 'prev');
    }
    elements.resultsPages.insertAdjacentHTML('afterbegin',buttons);
}

const createButtons = (page, type) => `
    <button class="btn-inline results__btn--${type === 'prev' ? 'prev' : 'next'}" data-goto=${type === 'prev' ? page - 1 : page + 1} >
    <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
    <svg class="search__icon">
        <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
    </svg>
    </button>
`

