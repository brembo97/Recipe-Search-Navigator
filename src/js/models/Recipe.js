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
        const numIng = this.ingredients.length;
        this.time = Math.ceil(numIng / 3) * 10;
    }

    calcServings(){
        this.servings = 4;
    }

    parseIngredients(){
        
        const shortFormats = ["tbsp", "tbsp", "cps", "cps", "ozs", "ozs"];
        const longFormats = ["teaspoons", "teaspoon", "cups", "cup", "ounces", "ounce", "kg", "g"];

        const newIngredients = this.ingredients.map(el => {
            //1) Standarize the format
            let currentIngredient = el.toLowerCase();
            longFormats.forEach((format, i) => {
               currentIngredient = currentIngredient.replace(format, shortFormats[i]);
            })
            //2) Remove Paranthesis
            currentIngredient = currentIngredient.replace(/\s*\(.*?\)\s*/g, ' ');
            //3) Parse into amount, unit and name

            //logic to find if the ingredient includes a unit and the index of the unit if it does
            let arrIng = currentIngredient.split(' ')
            let unitIndex = arrIng.findIndex(el2 => shortFormats.includes(el2));

            let parsedIng = {
                amount: 1,
                unit: '',
                name: ''
            }
            //Includes unit
            if(unitIndex > -1){
                parsedIng.amount = eval(arrIng.slice(0, unitIndex).join('+'));
                parsedIng.unit = arrIng.slice(unitIndex, unitIndex + 1).toString();
                parsedIng.name = arrIng.slice(unitIndex + 1).join(' ');

                //Edge case '3-1/4'
                if(arrIng[0].includes('-')){
                    parsedIng.amount = eval(arrIng[0].replace('-','+'));
                }
            //No unit but includes amount
            }else if(parseInt(arrIng[0], 10)){
                parsedIng.amount = parseInt(arrIng[0],10);
                parsedIng.name = arrIng.slice(1).join(' ');

                //Edge case '3-4'
                if(arrIng[0].includes('-')){
                    parsedIng.amount = eval(arrIng[0].replace('-','/'));
                }
            //No unit or amount
            }else if(unitIndex === -1){
                parsedIng.name = currentIngredient;
            }

            return parsedIng;
        })
        this.ingredients = newIngredients;
    }

    updateServings(type){
        //update servings
        const newServings = type === 'decr' ? this.servings - 1 : this.servings + 1;
        //update ingredients
        this.ingredients.forEach(ing => {
            ing.amount *= newServings/this.servings;
        })
        this.servings = newServings;
    }
    
}