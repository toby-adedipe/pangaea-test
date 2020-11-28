import { useContext, useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import CartItems from './CartItems';
import { ProductContext } from './context';
import '../styles/Cart.css';
import '../styles/Products.css';

const Cart = () => {
    const { cartItems, total, currency, changeCurrency } = useContext(ProductContext);
    const [ value, setValue ]  = useState('');

    const GET_CURRENCY = gql`
        query{
            currency
        }
`
    const { loading, error, data } = useQuery(GET_CURRENCY);
    
    const handleChange = (event)=>{
        changeCurrency(event.target.value)
    }

    return (
        <div id="cart">
            <h5 className="cart-title">YOUR CART</h5>
            <select
                onChange={handleChange}
            >
                {
                    loading
                    ? null
                    : error
                        ? null
                        : data.currency.map((curr)=>(
                            <option key={curr} value={curr}>{curr}</option>
                        ))
                }
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