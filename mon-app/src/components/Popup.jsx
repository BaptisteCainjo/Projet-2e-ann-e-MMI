import React, { useState } from 'react';

export default function Popup({ selectedArticles, onClose }) {
  const [response, setResponse] = useState('');

  const [valueBtnValidate, setValueBtnValidate] = useState('Oui, je supprime');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCloseClick = () => {
    onClose();
  };

  async function deleteArticle() {
    try {
      setIsDeleting(true);
      // console.log(setIsDeleting);
      for (const article of selectedArticles) {
        // console.log(article.id)

        let response = await fetch(`http://127.0.0.1:8000/wp-json/wc/v3/products/${article.id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Accept': 'application/json'
          },
        });
        setValueBtnValidate('Suppression en cours..');

        if (response.ok) {
          let responseData = await response.text();
          setResponse(responseData);

        } else {
          setResponse("Error code " + response.status + ": " + await response.text());
        }
      }
    } catch (error) {
      setResponse("Error: " + error.message);
    }
    setIsDeleting(false);
    window.location.reload();
  }


  return (

    <div className="popup">
      <div className='popupContent'>
        <div>
          <a className='btn-close' onClick={handleCloseClick}></a>
        </div>
        <h2>Confirmer la suppression ?</h2>

        <ul>
          {selectedArticles.map((article) => (
            <li key={article.id}>
              {`${article.articleType.charAt(0).toUpperCase() + article.articleType.slice(1)}: ${article.createur} - ${article.titre}`}
            </li>
          ))}
        </ul>
        <div>
          <button type='submit' className='btn-validate' onClick={deleteArticle}>
            {isDeleting ? 'Suppression en cours...' : valueBtnValidate}
          </button>
        </div>
      </div>
    </div>
  );
}
