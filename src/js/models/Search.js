import axios from 'axios';
import {apiURL} from '../config'

export default class Search{
    constructor(query){
        this.query = query;
    }

    async getRecipes(){

        try{
            const result = await axios(`${apiURL}/api/search?q=${this.query}`);
            this.result = result.data.recipes
            //console.log(this.result);
        }
        catch(error){
            console.log(error)
        }
    }
}