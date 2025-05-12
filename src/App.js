import logo from './logo.svg';
import axios from 'axios';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

// Components
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import GetProducts from './components/GetProducts';
import AddProducts from './components/AddProducts';
import MpesaPayment from './components/MpesaPayment';
import Carousel from './components/Carousel';
import Footer from './components/Footer';
import Location from './components/Location';
import Navbar from './components/Navbar';
import IceJewelMatch from './components/IceJewelMatch';
import JewelMeltRescue from './components/JewelMeltRescue';
import JewelCatch from './components/JewelCatch';

import ReviewForm from './components/ReviewForm';
// Context Providers
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';
import IceJewelryChatbot from './components/IceJewelryChatbot';
function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="App">
            <header className="App-header">
              <h1>ICEJEWELZ - BUY AND SELL ONLINE</h1>
            </header>
            
            <Navbar/>
            <div>
      {/* <IceJewelMatch />
      <JewelMeltRescue />
      <JewelCustomizer /> */}
    </div>
            <Routes>
              <Route path='/signin' element={<SignIn />} />
              <Route path='/signup' element={<SignUp />} />
              <Route path='/' element={<GetProducts />} />
              <Route path='/addproducts' element={<AddProducts />} />
              <Route path='/location' element={<Location />} />
              <Route path='/mpesapayment' element={<MpesaPayment />} />
              <Route path='/review' element={<ReviewForm />} />
              <Route path='/review/:productId' element={<ReviewForm />} />
              <Route path="/chatbot" element={<IceJewelryChatbot />} />
              <Route path='/jewelmatch' element={<IceJewelMatch />} />
              <Route path='/jewelrescue' element={<JewelMeltRescue />} />
             
              <Route path='/jewelcatch' element={<JewelCatch />} />

            </Routes>

            
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;