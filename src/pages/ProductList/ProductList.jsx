import { useEffect, useState } from 'react';
import ProductImage from '../../assets/product.jpg';
import FilterProduct from '../../components/FilterProduct/FilterProduct';
import ProductBox from '../../components/ProductBox/ProductBox';
import { getAllProduct, getProductByCategory } from '../../apis/fakeStoreProdApi';

//CSS imports
import './ProductList.css';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';

function ProductList(){

    const [productList, setProductList] = useState(null);

    const [query] = useSearchParams();

    async function downloadAllProduct(category){

        const downloadUrl = category ? getProductByCategory(category) : getAllProduct();
        const response = await axios.get(downloadUrl);
        console.log(response.data);
        setProductList(response.data);
        console.log(query.get("category"));
    }

    useEffect(() => {
        downloadAllProduct(query.get("category"));
    }, [query.get("category")]);

    return(
        <div className="container">
            <div className="row">
                <h1 className="product-list-title text-center"> All Products</h1>
                
                <div className="product-list-wrapper d-flex flex-row">
                <FilterProduct/>
                <div className="product-list-box" id="product-list-box">
                    {productList && productList.map((product) => <ProductBox 
                                                        {...product}
                                                        key={product.id}
                                                        
                                                    />
                        )}
                </div>
                </div>
            </div>
        </div>
    );
}

export default ProductList;