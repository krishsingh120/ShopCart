import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home/Home";
import Error from "../pages/Error/Error";
import ProductList from "../pages/ProductList/ProductList";
import ProductDetails from "../pages/ProductDetails/ProductDetails";
import Signup from "../pages/Authentication/Signup";
import Login from "../pages/Authentication/Login";
import Cart from "../pages/Cart/Cart";

function MainRoutes(){
    return (
        <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/products" element={<ProductList/>} />
            <Route path="/products/:id"  element={<ProductDetails/>}/>
            <Route path="/signup" element={<Signup/>} />
            <Route path="/signin" element={<Login/>} />
            <Route path="/cart/:userId" element={<Cart/>}/>
            <Route path="*" element={<Error/>} />
        </Routes>
    )
}
export default MainRoutes;