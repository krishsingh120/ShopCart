import { Link, useNavigate, useParams } from 'react-router-dom';

// CSS Imports
import './ProductDetails.css';
import { addProductToUserCart, getProduct } from '../../apis/fakeStoreProdApi';
import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import UserContext from '../../context/UserContext';
import CartContext from '../../context/CartContext';

function ProductDetails(){

    const {id} = useParams();
    const navigate = useNavigate();
    const {user} = useContext(UserContext);
    const [product, setProduct] = useState();
    const {setCart} = useContext(CartContext)

    async function downloadProductById(id){
        const response = await axios.get(getProduct(id));
        setProduct(response.data);
    }

    async function addProductToCart(){
        if(!user) return;
        const response = await axios.put(addProductToUserCart(), {userId: user.id, productId: id});
        setCart({...response.data});
        navigate(`/cart/${user.id}`);
    }

    useEffect(() => {
        downloadProductById(id);
    }, []);


    return (
        product && <div classNameName="product-details">
            <div classNameName="container">
                <div classNameName="row">
                    <div className="product-details-wrapper d-flex justify-content-around align-items-start flex-row">
                    <div className="product-image d-flex">
                        <img 
                            src={product.image}
                            id="product-image"
                        />
                    </div>

                    <div className="product-details-box d-flex flex-column">
                        <div className="product-details">
                            <div className="product-name" id="product-name">{product.title}</div>
                            <div className="product-price fw-bold" id="product-price">&#8377; {product.price}</div>
                            <div className="product-description">
                                <div className="product-description-title fw-bold" id="product-description-title">Description</div>
                                <div className="product-description-data" id="product-description-data">
                                    {product.description}
                                </div>
                            </div>
                        </div>
                        <div className="product-details-action btn btn-primary text-decoration-none" onClick={addProductToCart}>Add to Cart</div>
                            <Link 
                                to="/cart/2"
                                id="goToCartbtn" 
                                className="product-details-action btn btn-warning">
                                    <Link to={`/cart/${id}`} className='cartbtn' >
                                        Go to Cart
                                    </Link>
                            </Link>
                        </div>
                    </div>
                                   
                </div>
            </div>
        </div>
    )
}
export default ProductDetails;