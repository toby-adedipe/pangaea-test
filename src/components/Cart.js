import { useContext } from 'react';
import { gql, useQuery } from '@apollo/client';
import CartItems from './CartItems';
import { ProductContext } from './context';
import '../styles/Cart.css';
import '../styles/Products.css';
import Back from '../images/back.svg';

const Cart = () => {
    const { cartItems, total, currency, changeCurrency, updateCheck, checked, closeCart } = useContext(ProductContext);
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
        <div className="cart-container">
            <input type="checkbox" id="toggler" checked={checked} onChange={updateCheck}/>
            <div className="cart">
            <div className="cart-header">
                <div>
                    <img src={Back} alt="Back button" onClick={closeCart} className="back-btn"/>
                    <h5 className="cart-title">YOUR CART</h5>
                </div>
                <select
                    onChange={handleChange}
                    className="dropdown"
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
            </div>
                <div className="cart-list">
                    {
                        cartItems.length>0
                        ? cartItems.map(({id, title, price, image_url, quantity}) =>(
                            <CartItems key={id} id={id} title={title} price={price} image_url={image_url} quantity={quantity}/>
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
        </div>
    );
};

export default Cart;