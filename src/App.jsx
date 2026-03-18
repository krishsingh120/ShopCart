// library imports
import { useEffect, useState } from 'react';
import { jwtDecode } from "jwt-decode";
import { useCookies } from 'react-cookie';
import axios from 'axios';

//Context imports
import UserContext from './context/UserContext';

// Custom components
import Header from './components/Header/Header'
import MainRoutes from './routes/MainRoutes';

// CSS imports
import './App.css'
import CartContext from './context/CartContext';
import fetchUserCart from './helper/fetchUserCart';

function App() {

  const [user, setUser] = useState(null);
  const [token, setToken] = useCookies(['jwt-token']);
  const [cart, setCart] = useState({});

  async function accesstoken(){
    const res = await axios.get(`${import.meta.env.VITE_FAKE_STORE_URL}/accesstoken`, {withCredentials: true})
    setToken("jwt-token", res.data.token, {httpOnly: true})
    const tokenDetails = jwtDecode(res.data.token);
    console.log("access token details" + tokenDetails);
    setUser({username: tokenDetails.user, id: tokenDetails.id});
}

  async function load(){
    if(!user){
      accesstoken();
    }
    if(user){
      await fetchUserCart(user.id, setCart);
    }
  }

  useEffect(() => {
    load()
  }, [user]);


  return (
    <UserContext.Provider value={{user, setUser}}>
    <CartContext.Provider value={{cart, setCart}}>
      <div className='app-wrapper'>
        <Header className="header" color="light" light={true} expand="md" container="md" />
        <MainRoutes/>
      </div>
    </CartContext.Provider>
    </UserContext.Provider>
  )
}

export default App;
