import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import Home from './pages/Home/Home'
import Cart from './pages/Cart/Cart'
import PlaceOrder from './pages/PlaceOrder/PlaceOrder'
import Footer from './components/Footer/Footer'
import { useState } from 'react'
import LoginPopUp from './components/LoginPopUp/LoginPopUp'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Verify from './pages/verify/Verify';
import MyOrders from './pages/MyOrders/MyOrders'

const App = () => {
   const [showLogin,setShowLogin] =useState(false)
  return (
   <>
   <ToastContainer />
   {showLogin?<LoginPopUp setShowLogin={setShowLogin}/>:<></>}
    <div className='app'>
      <Navbar setShowLogin={setShowLogin}/>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/cart' element={<Cart/>} />
        <Route path='/order' element={<PlaceOrder/>} />
        <Route path='/verify' element={<Verify/>} />
        <Route path='/myOrders' element={<MyOrders/>} />
      </Routes>
    </div>
    <Footer/>
   </>
  )
}

export default App