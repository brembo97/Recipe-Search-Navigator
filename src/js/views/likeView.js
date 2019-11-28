import {elements} from './base'
import {limitRecipeTitle} from './searchView'

export const toggleLikeIcon = isLiked => {
    //Toggle the heart symbol
    const className = isLiked === false ? 'img/icons.svg#icon-heart' : 'img/icons.svg#icon-heart-outlined';
    const likedSymbol = elements.recipe.querySelector('.header__likes > use');
    likedSymbol.setAttribute("href", className);
}

export const toggleLikeMenu = numberOfLikes => {
    //Show the liked list on the UI if there are any
    if(numberOfLikes > 0) elements.likesField.style.setProperty('visibility', 'visible');
    else if (numberOfLikes === 0) elements.likesField.style.setProperty('visibility', 'hidden');
}

export const renderLikedItem = newLike => {
    
    const markup = `
        <li>
            <a class="likes__link" href="#${newLike.id}">
                <figure class="likes__fig">
                    <img src="${newLike.image}" alt="${newLike.image}">
                </figure>
                <div class="likes__data">
                    <h4 class="likes__name">${limitRecipeTitle(newLike.title)}</h4>
                    <p class="likes__author">${newLike.author}</p>
                </div>
            </a>
        </li>
    `
    elements.likedList.insertAdjacentHTML('beforeend', markup);
}

export const removeLikedItem = id => {
    const item = document.querySelector(`a.likes__link[href="#${id}"]`).parentElement;
    if(item) item.parentNode.removeChild(item);
}