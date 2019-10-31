import axios from 'axios';
import {apiURL} from '../config'

export default class Recipe {
    constructor(id){
        this.id = id;
    }

    async getRecipeInfo(){
        try{
            const recipeInfo = await axios(`${apiURL}/api/get?rId=${this.id}`);
            this.title = recipeInfo.data.recipe.title;
            this.publisher = recipeInfo.data.recipe.publisher;
            this.image = recipeInfo.data.recipe.image_url;
            this.ingredients = recipeInfo.data.recipe.ingredients;
            this.source = recipeInfo.data.recipe.source_url;
        }    
        catch(error){
            console.error();
        }
    }

    calcPrepTime(){
        //For every 3 ingredients 10 minutes to prep
        this.time = Math.ceil(this.ingredients.length / 3) * 10;
    }

    calcServings(){
        this.servings = 4;
    }
}