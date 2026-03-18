import { Link } from 'react-router-dom';
import './Category.css';

function Category({ itemName, filter='' }){

    const redirFilter = `/products?category=${filter}`;

    return(
        <div className="category-items d-flex justify-content-center align-items-center">
            <Link to={redirFilter}>{itemName}</Link>
        </div>
    )
}
export default Category;