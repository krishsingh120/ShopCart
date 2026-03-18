import { useContext, useEffect } from "react";
import CartContext from "../context/CartContext";
import fetchUserCart from "../helper/fetchUserCart";

function useCart(userId){
    const {cart, setCart} = useContext(CartContext);

    useEffect(() => {
        fetchUserCart(userId);
    }, [userId]);
    return [cart, setCart];
}
export default useCart;