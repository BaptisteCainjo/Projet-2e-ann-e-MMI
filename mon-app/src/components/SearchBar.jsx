import PropTypes from 'prop-types';
import React, { useState } from 'react';
import searchIcon from '../assets/images/searchBar.svg'

export default function SearchBar({ nbCarMin, onChange }) {
  const [searchValue, setSearchValue] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    onChange(searchValue);
  };

  const handleChange = (event) => {
    const value = event.target.value;
    setSearchValue(value);
    onChange(value);
  };

  return (
    <form onSubmit={handleSubmit} className="searchbar">
      <div className="search-input">
        <input
          className=""
          placeholder="Rechercher un produit"
          name="search"
          aria-label="Rechercher un produit"
          minLength={nbCarMin}
          value={searchValue}
          onChange={handleChange}
        />
        <img src={searchIcon} alt="Search Icon" className="search-icon" />
      </div>
    </form>
  );
}

SearchBar.propTypes = {
  nbCarMin: PropTypes.number,
  onChange: PropTypes.func.isRequired,
};