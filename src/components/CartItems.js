import { useContext } from 'react';
import { ProductContext } from './context';
import '../styles/CartItems.css'

const CartItems = ({id, title, price, image_url, quantity}) => {
    const { incrementQuantity, decrementQuantity, removeItem } = useContext(ProductContext);


    const currency = "USD";
    return (
        <div>
            <div className="cart-item">
                <p className="cancel-btn" onClick={()=>removeItem({id, price, quantity})}>X</p>
                <div className="left-section">
                    <div className="item-description">
                        <h6>{title}</h6>
                        <p>Made For: <span>Adedipe Oluwatobi</span></p>
                        <p>Combination | 25-34 </p>
                        <p>Two month supply shipped every two months</p>
                        <p>Cancel or change frequency anytime</p>
                    </div>
                    <div className="number-section">
                        <div className="quantity-section">
                            <span className="controllers" onClick={()=>decrementQuantity({id, price})}> - </span><span> {quantity} </span><span className="controllers" onClick={()=>incrementQuantity({id, price})}> + </span>
                        </div>
                        <div>
                            <span> {currency} </span><span>{price*quantity}</span>
                        </div>
                    </div>
                </div>
                <div className="item-image-container">
                    <img src={image_url} className="item-image" />
                </div>
            </div>
        </div>
    );
};

export default CartItems;