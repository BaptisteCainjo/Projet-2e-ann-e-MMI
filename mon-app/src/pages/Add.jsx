import { useState } from 'react';
import Form from '../components/Form';
import Navbar from '../components/Navbar';
import Header from '../components/Header';

export default function Add() {

  const [titlePage, setTitlePage] = useState('Ajouter un produit 🆕')

  return (
    <section>
      <Header titlePage={titlePage}/>
      <div className='container'>
        <div className='category'>
          <Navbar />
        </div>
        <Form />
      </div>
    </section>
  );
}
