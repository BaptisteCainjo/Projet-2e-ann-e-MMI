import { useContext, useEffect, useState } from "react";
import React from "react";
import { Link, useLocation } from 'react-router-dom';
import { GlobalContext } from '../App';
import Product from '../components/Product';

export default function Navbar() {
    const [clicked, setClicked] = useState(null);
    const [clickedClass, setClickedClass] = useState(null);
    const location = useLocation();


    useEffect(() => {
        if (location.pathname.includes("modifier")) {
            setClicked("modifier");
        } else if (location.pathname.includes("ajouter")) {
            setClicked("ajouter");
        }
    }, [location.pathname]);

    const separateUrl = () => {
        const pathElements = location.pathname.split("/");
        return pathElements[pathElements.length - 1];
    };

    useEffect(() => {
        if (location.pathname === "/ajouter/musique") {
            setClickedClass("musique");
        } else if(location.pathname === "/ajouter/livre") {
            setClickedClass("livre");
        }
        if (location.pathname === `/modifier/musique/${separateUrl()}`) {
            setClickedClass("musique");
        } else if(location.pathname === `/modifier/livre/${separateUrl()}`) {
            setClickedClass("livre");
        }
      }, [location.pathname]);


    return (
        <>
          {clicked === "ajouter" && (
            <>
              <Link
                to="/ajouter/musique"
                className={clickedClass === "musique" ? "clicked" : null}
              >
                Musique
              </Link>
              <Link
                to="/ajouter/livre"
                className={clickedClass === "livre" ? "clicked" : null}
              >
                Livre
              </Link>
            </>
          )}
      
          {clicked === "modifier" && (
            <>
                  <p className={clickedClass === "musique" ? "clicked" : null} separateUrl={separateUrl}> Musique
                  </p>
                   <p className={clickedClass === "livre" ? "clicked" : null}>Livre
                  </p>
            </>
          )}
        </>
      );
}
