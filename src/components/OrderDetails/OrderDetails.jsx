// CSS impors
import './OrderDetails.css';

function OrderDetails({title, price, image, quantity, onRemove}){
    const quantitymap = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    return(
            <>
            <div className="order-details-product d-flex flex-row">
                <div className="order-details-product-img d-flex">
                    <img src={image} alt="" />
                </div>
                <div className="order-details-product-data d-flex flex-column justify-content-center">
                    <div>{title}</div>
                    <div>{price}</div>
                </div>
                <div className="order-details-product-action d-flex flex-column">
                    <div className="order-details-product-quantity">
                        <div className="fw-bold">Quantity</div>
                        <div className="form-group">
                            <select className='form-select'>
                                {quantitymap.map((id) => <option selected={quantity == id} key={id} value={id}>{id}</option>)}
                            </select>
                        </div>
                        <button onClick={onRemove} className="order-details-product-remove btn btn-danger">
                            Remove
                        </button>
                    </div>
                </div>
            </div>
            <hr/>
            </>
    );
}
export default OrderDetails;