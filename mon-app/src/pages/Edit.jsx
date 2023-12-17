import React, { useState } from 'react';
import '../assets/css/style.css';
import Form from '../components/Form';
import Navbar from '../components/Navbar';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';


export default function Edit() {

  const [titlePage, setTitlePage] = useState('Modifier un produit ✏️')

  return (
    <section>
      <Header titlePage={titlePage}/>
      <div className='container'>
        <div className='category'>
          <Navbar/>
        </div>
        <Form />
      </div>
    </section>
  );
}
