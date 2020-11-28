import { useContext } from 'react';
import '../styles/Cart.css';
import '../styles/Products.css';
import CartItems from './CartItems';
import { ProductContext } from './context';

const Cart = () => {
    const currency = "USD";
    const { cartItems, total } = useContext(ProductContext);

    return (
        <div id="cart">
            <h5 className="cart-title">YOUR CART</h5>
            <select>
                <option>USD</option>
            </select>
            <div className="cart-list">
                {
                    cartItems.length>0
                    ? cartItems.map(({id, title, price, image_url, quantity}) =>(
                        <CartItems id={id} title={title} price={price} image_url={image_url} quantity={quantity}/>
                    ))
                    : null
                }
            </div>
            <div className="checkout-footer">
                <div className="footer-container">
                    <div className="subtotal-section">
                        <p>Subtotal</p>
                        <div className="subtotal"><span> {currency} </span><span>{total}</span></div>
                    </div>
                    <div className="footer-btns">
                        <button className="revert-btn">REVERT TO ONE TIME PURCHASE</button>
                        <button className="checkout-btn">PROCEED TO CHECKOUT</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;