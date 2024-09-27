import Home from './components/Home'
import CardDetail from './components/CardDetail'
import EditPage from './components/EditPage'
import {BrowserRouter, Route, Routes} from 'react-router-dom'

const App = () => {
  return (
   <BrowserRouter>
    <Routes>
      <Route index element={<Home/>}/>
      <Route path="/card" element={<CardDetail/>}/>
      <Route path="/edit" element={<EditPage/>}/>
    </Routes>
   </BrowserRouter>
  )
}

export default App