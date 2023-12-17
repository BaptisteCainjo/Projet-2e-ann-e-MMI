import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { store } from './store/store'
import { createContext } from 'react'

import Add from './pages/Add';
import Edit from './pages/Edit';
import Page404 from './pages/Page404';
import ListProducts from './pages/ListProducts';


export const GlobalContext = createContext();


export default function App() {
  return (
     <GlobalContext.Provider value={store} >
        <Routes>
          <Route path="/" element={<ListProducts />}></Route>
          <Route path="/ajouter/musique" element={<Add />}></Route>
          <Route path="/ajouter/livre" element={<Add />}></Route>
          <Route path="/modifier/musique/:productId" element={<Edit />}></Route>
          <Route path="/modifier/livre/:productId" element={<Edit />}></Route>
          <Route path="/*" element={<Page404 />}></Route>
        </Routes>
    </GlobalContext.Provider>
  )
}