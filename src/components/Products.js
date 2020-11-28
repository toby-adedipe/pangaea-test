import Cart from './Cart';
import update from 'immutability-helper';

import { gql, useQuery } from '@apollo/client';
import '../styles/Products.css';
import { useEffect, useState } from 'react';
import { ProductContext } from './context';

const Products = () => {
    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [currency, setCurrency] = useState("USD");

    const productContext = ({
        total: total,
        cartItems: cartItems,
        incrementQuantity: ({id, price})=>{
            const idx = cartItems.findIndex(obj=>obj.id === id);
            setCartItems((cartItems)=>(update(cartItems, {[idx]: {quantity: {$apply: function(x){return x + 1; }}}})));
            setTotal(total=>total+=price);
        },
        decrementQuantity: ({id,price})=>{
            const idx = cartItems.findIndex(obj=>obj.id === id);
            if(cartItems[idx].quantity === 1){
                setCartItems((cartItems)=>(update(cartItems, {[idx]: {quantity: {$apply: function(x){return x - 1; }}}})));
                setCartItems((cartItems)=>(update(cartItems, {$splice: [[idx, 1]]})));
            }else{
                setCartItems((cartItems)=>(update(cartItems, {[idx]: {quantity: {$apply: function(x){return x - 1; }}}})));
            }
            setTotal(total=>total-=price);
        },
        removeItem: ({id, price, quantity})=>{
            const idx = cartItems.findIndex(obj=>obj.id === id);
            setCartItems((cartItems)=>(update(cartItems, {$splice: [[idx, 1]]})));
            setTotal(total=>total-=(price*quantity));
        },
        
        currency: currency,
        changeCurrency: (newCurrency)=>{
            setCurrency(newCurrency);
            //update the price part of the state
            refetch();

        }
    })

    const UPDATE_CURRENCY = gql`
        query{
            price(currency: ${currency})
        }
    `
    const GET_PRODUCTS = gql`
        query{
            products{
            id,
            title,
            image_url,
            price(currency: ${currency})
            },
        } 
    `

    const { loading, error, data, refetch } = useQuery(GET_PRODUCTS);


    const addToCart = ({id, title, image_url, price})=>{
        if(cartItems.findIndex(obj=>obj.id === id) !== -1){
            const idx = cartItems.findIndex(obj=>obj.id === id);
            //installed and imported a helper library to help with the immutabiltiy of objects in states
            setCartItems((cartItems)=>(update(cartItems, {[idx]: {quantity: {$apply: function(x){return x + 1; }}}})));
            console.log(cartItems[idx].quantity);
        }else{
            setCartItems(cartItems=>cartItems.concat({id, title, image_url, price, quantity: 1}))
        }       
        setTotal(total=>total+=price);
    }
    return (
        <ProductContext.Provider value={productContext}>
        <div className="products-page">
            <div className="container">
                <div id="top-bg">
                    <h1>All Products</h1>
                    <p className="page-description">A 360&#176; Look at Lumin</p>
                </div>
                <div id="products-bg">
                    <div id="all-products">
                        {
                            loading
                            ? <p>Loading...</p>
                            : error
                                ? <p>Error couldn't fetch data :(</p>
                                : data.products.map(({ id, title, image_url, price}) => (
                                    <div className="product-container">
                                        <div className="product">
                                            <div className="image-container">
                                                <img src={image_url} className="product-image" />
                                            </div>
                                            <div>
                                                <p className="product-title">{title}</p>
                                                <p className="product-price"> From: {currency} <span> {price}</span></p>
                                            </div>
                                            <button className="cart-btn" onClick={()=>addToCart({id, title, image_url, price})}> Add to Cart </button>
                                        </div>
                                    </div>
                                ))
                        }
                    </div>
                </div>
            </div>
            <Cart/>
        </div>
        </ProductContext.Provider>
    );
};

export default Products;