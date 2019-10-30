import axios from 'axios';

export default class Search{
    constructor(query){
        this.query = query;
    }

    async getRecipes(){

    //    const proxy;
    //    const key;
        const BasicURL = 'https://forkify-api.herokuapp.com';
        try{
            const result = await axios(`${BasicURL}/api/search?q=${this.query}`);
            this.result = result.data.recipes
            //console.log(this.result);
        }
        catch(error){
            console.log(error)
        }
    }
}