import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { GlobalContext } from '../App';


export default function Form() {
    const location = useLocation();

    const separateUrl = () => {
        const pathElements = location.pathname.split("/");
        return pathElements[pathElements.length - 1];
    };

    const { productStore } = useContext(GlobalContext);
    // console.log(productStore)

    let [contentId, setContentId] = useState('');
    let [contentArtist, setContentArtist] = useState('');
    let [contentTitre, setContentTitre] = useState('');
    let [contentImage, setContentImage] = useState('');
    let [contentStock, setContentStock] = useState(null);
    let [contentPrix, setContentPrix] = useState(null);
    let [contentNbPages, setContentNbPages] = useState(null);
    let [contentIsbn, setContentIsbn] = useState('');
    let [contentDate, setContentDate] = useState(null);

    const labelInputArtist = useRef(null);
    const placeholderInputArtist = useRef(null);
    const placeholderInputTitre = useRef(null);
    const labelInputPochette = useRef(null);
    const placeholderInputPochette = useRef(null);

    const [response, setResponse] = useState('');


    const navigate = useNavigate();

    async function addArticle(event) {
        event.preventDefault();
        let jsonData = {
            id: contentId,
            titre: contentTitre,
            prix: contentPrix,
            disponibilite: contentStock,
            image: contentImage,
            createur: contentArtist,
            ISBN: contentIsbn,
            nbPages: contentNbPages,
            dateDeParution: contentDate,
            article_type: location.pathname === '/ajouter/livre' ? 'livre' : 'musique',
        };

        let jsonString = JSON.stringify(jsonData);

        let requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Accept': 'application/json'
            },
            body: jsonString
        };

        let response = await fetch("http://127.0.0.1:8000/wp-json/wc/v3/products", requestOptions);
        // console.log(response);
        if (response.ok) {
            if (response.headers.get("Location")) {
                let responseData = await response.text();
                setResponse(responseData);
                setTimeout(() => {
                    navigate('/');
                    window.location.reload();
                }, 1000);

            } else {
                setResponse("Error, no \"Location\" in response headers");
            }
        } else {
            setResponse("Error code " + response.status);
        }
    }

    useEffect(() => {
        if (location.pathname === "/ajouter/livre") {
            labelInputArtist.current.textContent = "Auteur"
            placeholderInputArtist.current.placeholder = "Entrez le nom de l'auteur"
            placeholderInputTitre.current.placeholder = "Entrez le titre du livre"
            labelInputPochette.current.textContent = "Couverture"
            placeholderInputPochette.current.placeholder = "Entrez l'URL de la couverture du livre"
        } else {
            labelInputArtist.current.textContent = "Artiste"
            placeholderInputArtist.current.placeholder = "Entrez le nom de l'artiste"
            placeholderInputTitre.current.placeholder = "Entrez le titre de l'album"
            labelInputPochette.current.textContent = "Pochette"
            placeholderInputPochette.current.placeholder = "Entrez l'URL de la pochette de l'album"
        }
        productStore.articles.forEach(article => {
            if (article.id === separateUrl()) {
                setContentId(article.id);
                setContentArtist(article.createur);
                setContentTitre(article.titre);
                setContentImage(article.image);
                setContentStock(article.disponibilite);
                setContentPrix(article.prix);
                setContentNbPages(article.nbPages);
                setContentIsbn(article.ISBN);
                setContentDate(article.dateDeParution);

            }
        });
    }, [location.pathname]);

    const handleChangeArtist = (e) => {
        setContentArtist(e.target.value)
    }
    const handleChangeTitle = (e) => {
        setContentTitre(e.target.value)
    }
    const handleChangePochette = (e) => {
        setContentImage(e.target.value)
    }
    const handleChangeStock = (e) => {
        setContentStock(e.target.value)
    }
    const handleChangePrix = (e) => {
        setContentPrix(e.target.value)
    }
    const handleChangeNbPages = (e) => {
        setContentNbPages(e.target.value)
    }
    const handleChangeIsbn = (e) => {
        setContentIsbn(e.target.value)
    }
    const handleChangeDate = (e) => {
        setContentDate(e.target.value)
    }

    // console.log(productStore)

    async function updateArticle() {
        let json = JSON.stringify({
            id: contentId,
            titre: contentTitre,
            prix: contentPrix,
            disponibilite: contentStock,
            image: contentImage,
            createur: contentArtist,
            ISBN: contentIsbn,
            nbPages: contentNbPages,
            dateDeParution: contentDate,
            article_type: location.pathname === `/ajouter/livre/${contentId}` || location.pathname === `/modifier/livre/${contentId}` ? 'livre' : 'musique',
        });
        // console.log(location.pathname)

        try {
            let response = await fetch(`http://127.0.0.1:8000/wp-json/wc/v3/products/${contentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'Accept': 'application/json'
                },
                body: json
            });

            if (response.ok) {
                if (response.headers.get("Location")) {
                    let responseData = await response.text();
                    setResponse(responseData);
                        navigate('/');
                        window.location.reload();
                } else {
                    setResponse("Error, no \"Location\" in response headers");
                }
            } else {
                setResponse("Error code " + response.status + ": " + await response.text());
            }
        } catch (error) {
            setResponse("Error: " + error.message);
        }
    }


    return (

            <form className='addedit' action="/">
                <div className="field">
                    <label htmlFor="artist" ref={labelInputArtist}>Artiste</label>
                    <input value={contentArtist} type="text" name="name" id="name" placeholder="Entrez le nom de l'artiste" ref={placeholderInputArtist} onChange={handleChangeArtist} />
                </div>
                <div className="field">
                    <label htmlFor="title">Titre</label>
                    <input value={contentTitre} type="text" name="title" id="title" placeholder="Entrez le titre de l'album" ref={placeholderInputTitre} onChange={handleChangeTitle} />
                </div>
                <div className="field">
                    <label htmlFor="image" ref={labelInputPochette}>Pochette</label>
                    <input value={contentImage} type="text" name="image" id="image" placeholder="Entrez l'URL de la pochette de l'album" ref={placeholderInputPochette} onChange={handleChangePochette} />
                </div>
                <div className='from-row'>
                    <div className="field">
                        <label htmlFor="stock">Stock</label>
                        <input value={contentStock} type="number" name="stock" id="stock" placeholder="Entrez le stock disponible" min={0} max={999} onChange={handleChangeStock} />
                    </div>
                    <div className="field">
                        <label htmlFor="price">Prix</label>
                        <input value={contentPrix} type="number" name="price" id="price" placeholder="Entrez le prix" min={0} max={999} onChange={handleChangePrix} />
                    </div>
                </div>

                {(location.pathname === '/ajouter/livre' || location.pathname === `/modifier/livre/${separateUrl()}`) && (
                    <div className='from-row'>
                        <div className="field">
                            <label htmlFor="stock">ISBN</label>
                            <input value={contentIsbn} type="text" name="isbn" id="isbn" placeholder="Entrer le numéro ISBN" onChange={handleChangeIsbn} />
                        </div>
                        <div className="field">
                            <label htmlFor="price">Nombre de pages</label>
                            <input value={contentNbPages} type="number" name="pages" id="pages" placeholder="Entrer le nombre de pages" min={0} max={9999} onChange={handleChangeNbPages} />
                        </div>
                    </div>
                )}

                <div className="field form-last">
                    <label htmlFor="date">Année</label>
                    <input value={contentDate} type="number" name="date" id="date" placeholder="YYYY" min={0} max={2024} onChange={handleChangeDate} />
                </div>
                {(location.pathname === `/modifier/musique/${separateUrl()}` || location.pathname === `/modifier/livre/${separateUrl()}`) && (
                    <Link>
                        <button type='submit' onClick={updateArticle}>Sauvegarder l'article</button>
                    </Link>
                )}
                {(location.pathname === '/ajouter/musique' || location.pathname === `/ajouter/livre`) && (
                    <Link>
                        <button type='submit' onClick={addArticle}>Publier l'article</button>
                    </Link>
                )}




            </form >
    )

}