import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import imageArrow from '../assets/images/arrow.svg'

export default function Product({ data, onSelectedChange, isSelected }) {
    const { ISBN, createur, titre, id, dateDeParution, prix, disponibilite, articleType, nbPages, image } = data;

    const [checked, setChecked] = useState(isSelected);

    let createurTitre = `${createur} - ${titre}`

    if (createurTitre.length > 30) {
        createurTitre = createurTitre.substring(0, 30) + '[...]';
    }

    const [showInfo, setShowInfo] = useState(false);

    const toggleInfo = () => {
        setShowInfo(!showInfo);
    };
    console.log(isSelected)

    const handleCheckboxToggle = (e) => {
        onSelectedChange(e.target.checked, data);
        setChecked(e.target.checked);
    };

    useEffect(() => {
        setChecked(isSelected);
    }, [isSelected]);

    return (
        <>
            <div className="aProduct">
                <div className="infoProduct">
                    <div className="infoProductCheckbox">
                        <input type="checkbox" name="selected" defaultChecked={isSelected} onChange={handleCheckboxToggle} checked={checked}></input>
                        <p>{createurTitre}</p>
                    </div>
                    {articleType === 'livre' ? (
                        <Link className="btn-modified" to={`/modifier/livre/${id}`}></Link>
                    ) : articleType === 'musique' ? (
                        <Link className="btn-modified" to={`/modifier/musique/${id}`}></Link>
                    ) : null}
                </div>
                <div className="voirMasquerInfos" onClick={toggleInfo}>
                    <button>{showInfo ? 'Masquer' : 'Voir'} les informations</button>
                    <img src={imageArrow} className={showInfo ? 'active' : ''} alt="" />
                </div>

                {showInfo && (
                    <div className="retailProduct">
                        <table>
                            <tbody>
                                <tr>
                                    <td className="nameLabel">ID</td>
                                    <td className="valueLabel">{id}</td>
                                </tr>
                                <tr>
                                    <td className="nameLabel">{articleType === 'livre' ? 'Auteur' : 'Artiste'}</td>
                                    <td className="valueLabel">{createur}</td>
                                </tr>
                                <tr>
                                    <td className="nameLabel">Titre</td>
                                    <td className="valueLabel">{titre}</td>
                                </tr>
                                <tr>
                                    <td className="nameLabel">Date</td>
                                    <td className="valueLabel">{dateDeParution}</td>
                                </tr>
                                <tr>
                                    <td className="nameLabel">Prix</td>
                                    <td className="valueLabel">{prix}€</td>
                                </tr>
                                <tr>
                                    <td className="nameLabel">Stock</td>
                                    <td className="valueLabel">{disponibilite}</td>
                                </tr>
                                {articleType !== 'musique' && (
                                    <>
                                        <tr>
                                            <td className="nameLabel">ISBN</td>
                                            <td className="valueLabel">{ISBN}</td>
                                        </tr>
                                        <tr>
                                            <td className="nameLabel">Nombre de page</td>
                                            <td className="valueLabel">{nbPages}</td>
                                        </tr>
                                    </>
                                )}
                                <tr>
                                    <td className="nameLabel">Image</td>
                                    <td className="valueLabel">
                                        {
                                        articleType == 'musique' ? (
                                            <img src={image} alt="" />
                                        ) : (
                                            <img src={`../assets${image}`} alt="" />
                                        )}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="nameLabel">Type d'article</td>
                                    <td className="valueLabel">{articleType.charAt(0).toUpperCase() + articleType.slice(1)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

        </>
    )
}
