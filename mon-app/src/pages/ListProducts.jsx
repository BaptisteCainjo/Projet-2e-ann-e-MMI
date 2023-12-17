import { useState, useEffect, useContext } from 'react';
import '../assets/css/style.css';
import '../assets/css/searchbar.css';
import Product from '../components/Product';
import { GlobalContext } from '../App';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Popup from '../components/Popup';


import SearchBar from '../components/SearchBar';

function ListProducts() {

  const { productStore } = useContext(GlobalContext);

  console.log(productStore)
  const [titlePage, setTitlePage] = useState('Produits');
  const [filter, setFilter] = useState('');
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [selectedArticles, setSelectedArticles] = useState([]); // articles sélectionnées
  const [showPopup, setShowPopup] = useState(false); //popup initialisé à false
  const [isAllSelected, setIsAllSelected] = useState(false);

  useEffect(() => {
    setFilteredArticles(
      productStore.articles.filter((article) =>
        article.titre.toLowerCase().includes(filter.toLowerCase()) ||
        article.id.toString().toLowerCase().includes(filter.toLowerCase()) ||
        article.createur.toLowerCase().includes(filter.toLowerCase()) ||
        article.articleType.toLowerCase().includes(filter.toLowerCase())
      )
    );
  }, [productStore.articles, filter]);

  const handleCheckboxChange = (isChecked, data) => {
    if (isChecked) {
      setSelectedArticles([...selectedArticles, data]); //ajout un nouvel article dans mon selectedArticles
    } else {
      setSelectedArticles(selectedArticles.filter((article) => article.id !== data.id));
    }
  };

  const changeFilter = (newFilter) => {
    setFilter(newFilter);
  };

  const handleDeleteClick = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleAllSelectedChange = (event) => {
    setIsAllSelected(event.target.checked);
    // console.log(event.target.checked);
    if (event.target.checked) {
      setSelectedArticles([...productStore.articles])
    }else {
      setSelectedArticles([])
    }
  };


  return (
    <>
      {showPopup && <Popup selectedArticles={selectedArticles} onClose={handleClosePopup} />}
      <section>
        <Header titlePage={titlePage} isDeleted={selectedArticles.length > 0} handleDeleteClick={handleDeleteClick} />
        <SearchBar nbCarMin={3} onChange={changeFilter} />
        <div className="setTable">
          <div className="navTab">
            <h2>Tous les produits <span> {filteredArticles.length} {filteredArticles.length > 1 ? 'articles' : 'article'} </span>
              {selectedArticles.length > 0 && (
                <span> dont {selectedArticles.length} {selectedArticles.length === 1 ? 'sélectionné' : 'sélectionnés'}
                </span>
              )}
            </h2>
            <div className="checkboxAllSelected">
            <label htmlFor="checkboxName">Tout supprimer</label>
              <input type="checkbox" name="selected" checked={isAllSelected} onChange={handleAllSelectedChange}/>
            </div>
          </div>
          <hr></hr>
          <div className="setProducts">
            {filteredArticles.map((article) => (
              <div key={article.id} className="product">
                <Product key={article.id} data={article} onSelectedChange={handleCheckboxChange} isSelected={isAllSelected}/>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default observer(ListProducts);
