

export default class Like{
    constructor(){
        this.listOfLikes = [];
    }

    addLike(id, title, author, image){
        const newLike = {
            id: id,
            title: title,
            author: author,
            image: image,
            isLiked: false
        }
        this.listOfLikes.push(newLike);
        return newLike;
    }

    deleteItem(id){
        const index =  this.listOfLikes.findIndex(el => el.id === id);
        return this.listOfLikes.splice(index, 1);
      }

    numberOfLikes(){
        return this.listOfLikes.length;
    }

    isLiked()
}