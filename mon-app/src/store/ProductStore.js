import { makeAutoObservable } from "mobx";
import { useState, useEffect } from 'react';
import Product from "./Product";


class ProductStore{

    _articles = [];
    

    constructor(){
        makeAutoObservable(this);
        this.loadProducts() ;
    }

    // const [response, setResponse] = useState('');
    // const [donnees, setDonnees] = useState([]);

    async loadProducts(){
        try {
            const response = await fetch('http://127.0.0.1:8000/wp-json/wc/v3/products');
            const data = await response.json(); 

            this._articles = data.map(productData => {
                const { id, createur, titre, dateDeParution, prix, disponibilite, image, ISBN, nbPages, article_type:articleType } = productData;
                return new Product(id, createur, titre, dateDeParution, prix, disponibilite, image, ISBN, nbPages, articleType);
            });

        } catch (error) {
            console.error('Error loading students:', error);
        }
    }

    get articles(){
        return this._articles;
    }
    set articles(value) {
        this._articles = value;
    }
    //  handleDelete = (id) => {
    //     setResponse((prevDonnees) => prevDonnees.filter((response) => response.id !== id));
    // };
}

export default ProductStore;