import { makeAutoObservable} from "mobx";


class Product {
    _id;
    _createur;
    _titre;
    _dateDeParution;
    _prix;
    _disponibilite;
    _image;
    _ISBN;
    _nbPages;
    _articleType;



    constructor(id, createur, titre, dateDeParution, prix, disponibilite, image, ISBN, nbPages, articleType) {
        this._id = id;
        this.createur = createur;
        this.titre = titre;
        this.dateDeParution = dateDeParution;
        this.prix = prix;
        this.disponibilite = disponibilite;
        this.image = image;
        this.ISBN = ISBN;
        this.nbPages = nbPages;
        this.articleType = articleType;
        makeAutoObservable(this);
    }



    /* accesseurs d'écriture */

    get id() {
        return this._id;
    }
    get createur() {
        return this._createur;
    }
    get titre() {
        return this._titre;
    }
    get dateDeParution() {
        return this._dateDeParution;
    }
    get prix() {
        return this._prix;
    }
    get disponibilite() {
        return this._disponibilite;
    }
    get image() {
        return this._image;
    }
    get ISBN() {
        return this._ISBN;
    }
    get nbPages() {
        return this._nbPages;
    }
    get articleType() {
        return this._articleType;
    }


/* accesseurs de lecture */
    set id(value) {
        this._id = value;
    }
    set createur(value) {
        this._createur = value;
    }

    set titre(value) {
        this._titre = value;
    }

    set dateDeParution(value) {
        this._dateDeParution = value;
    }

    set prix(value) {
        this._prix = value;
    }

    set disponibilite(value) {
        this._disponibilite = value;
    }

    set image(value) {
        this._image = value;
    }


    set ISBN(value) {
        this._ISBN = value;
    }

    set nbPages(value) {
        this._nbPages = value;
    }

    set articleType(value) {
        this._articleType = value;
    }
}

export default Product;