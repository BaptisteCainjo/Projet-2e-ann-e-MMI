import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

export default function Header({ titlePage, isDeleted, handleDeleteClick }) {
    const location = useLocation();
    const separateUrl = () => {
        const pathElements = location.pathname.split("/");
        return pathElements[pathElements.length - 1];
    };
    const [url, setUrl] = useState(location.pathname === "/ajouter/livre" || location.pathname === "/ajouter/musique" || location.pathname === `/modifier/livre/${separateUrl()}` || location.pathname === `/modifier/musique/${separateUrl()}` ? null : 'star')


    return (
        <div className="header">
            <div className="btn-align">
                {location.pathname !== '/' && (
                    <Link to='/' className="btn-retour">Retour</Link>
                )}
                <h1 className={url}>{titlePage}</h1>
            </div>

            {url && (
                <div className="btn-header">
                    {isDeleted && (
                        <a className="btn-delete" onClick={handleDeleteClick}>Supprimer</a>
                    )}
                    <Link className="btn-add" to="/ajouter/musique">
                        Ajouter
                    </Link>
                </div>
            )}
        </div>
    )
}