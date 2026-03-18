// CSS imports
import { Link } from 'react-router-dom';
import './Cart.css';
import OrderDetails from '../../components/OrderDetails/OrderDetails';
import { useContext, useEffect, useState } from 'react';
import CartContext from '../../context/CartContext';
import axios from 'axios';
import { getProduct, updateProuctInCart } from '../../apis/fakeStoreProdApi';
import UserContext from '../../context/UserContext';

function Cart(){


    const {cart, setCart} = useContext(CartContext);
    const [products, setProduct] = useState([]);
    const {user} = useContext(UserContext);

    async function downloadCart(cart){
        if(!cart || !cart.products) return;

        const productMapping = {};
        cart.products.forEach(product => {
            productMapping[product.productId] = product.quantity;
        });

        const productPromise = cart.products.map((product) => axios.get(getProduct(product.productId)));
        const productPromiseResponse = await axios.all(productPromise);
        const downloadProduct = productPromiseResponse.map((product) => ({...product.data, quantity: productMapping[product.data.id]}));
        setProduct(downloadProduct);

        
    }

    async function updateProduct(productId, quantity){
        if(!user) return;
        const response = await axios.put(updateProuctInCart(), {userId: user.id, productId, quantity});
        setCart({...response.data});
    }

    useEffect(() => {
        downloadCart(cart);
    }, [cart])

    return(
        <div className="container">
            <div className="row">
                <h2 className="cart-title text-center">Your Cart</h2>
            </div>
            <div className="cart-wrapper d-flex flex-row">
                
                <div className="orderDetails d-flex flex-column" id="orderDetails">
                <div className="order-details-title fw-bold">Order Details</div>
                    {products.length > 0 && products.map((product) => <OrderDetails 
                                                                        key={product.id}
                                                                        title={product.title}
                                                                        image={product.image}
                                                                        price ={product.price}
                                                                        quantity={product.quantity}
                                                                        onRemove={() => updateProduct(product.id, 0)}
                                                                     />)}
                </div>
                <div className="priceDetails d-flex flex-column">
                    <div className="price-details-box">
                        <div className="price-details-title fw-bold">Price Details</div>
                        <div className="price-details-data">
                            <div className="price-details-item d-flex flex-row justify-content-between">
                                <div>Price</div>
                                <div id="total-price">1000</div>
                            </div>
                            <div className="price-details-item d-flex flex-row justify-content-between">
                                <div>Discount</div>
                                <div>10</div>
                            </div>
                            <div className="price-details-item d-flex flex-row justify-content-between">
                                <div>Delivery Charges</div>
                                <div>Free</div>
                            </div>
                            <div className="price-details-item d-flex flex-row justify-content-between">
                                <div>Total Cost</div>
                                <div id="net-price">2000</div>
                            </div>
                        </div>
                    </div>
                    <div className="price-details-b-group d-flex">
                        <Link 
                            to="/products" 
                            className="continue-shopping-btn btn btn-info text-decoration-none">
                            Continue Shopping
                        </Link>
                        <Link
                            to="/checkout"
                            className="checkout-btn btn btn-primary text-decoration-none">
                            Checkout
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Cart;