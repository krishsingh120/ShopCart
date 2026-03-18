
// CSS Imports
import { Link } from 'react-router-dom';
import './ProductBox.css';

function ProductBox(props){

    
    return(
        <Link 
            to={`/products/${props.id}`}
            className="product-item text-decoration-none d-inline-block text-center">
            <div className="product-image">
                <img src={props.image}/>
            </div>
            <div className="product-name">{props.title.substring(0, 12) + "..."}</div>
            <div className="product-price">&#8377; {props.price}</div>
        </Link>
    );
}
export default ProductBox;