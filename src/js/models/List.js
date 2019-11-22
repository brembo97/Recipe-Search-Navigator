import uniqid from 'uniqid';

export default class List{
    constructor(){
        this.list = [];
    }

    addItem(amount, unit, name){
        const item = {
            id: uniqid(),
            amount,
            unit,
            name
        }
        this.list.push(item);
        return item;
    }

    deleteItem(id){
      const index =  this.list.findIndex(el => el.id === id);
      return this.list.splice(index, 1);
    }

    updateItem(id, newAmount){
        this.list.find(el => el.id === id).amount = newAmount;
    }
}