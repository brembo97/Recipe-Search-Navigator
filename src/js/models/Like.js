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

    deleteLike(id){
        const index =  this.listOfLikes.findIndex(el => el.id === id);
        return this.listOfLikes.splice(index, 1);
      }

    numberOfLikes(){
        return this.listOfLikes.length;
    }

    isLiked(id){
        const checkId = this.listOfLikes.findIndex(el => el.id === id);
        return checkId === -1 ? false : true
    }

    persistData(){
        window.localStorage.setItem('likes', JSON.stringify(this.listOfLikes));
    }

    retrieveData(){
        const updatedList = JSON.parse(window.localStorage.getItem('likes'));
        if(updatedList) this.listOfLikes = updatedList;
    }
}