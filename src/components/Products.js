import Cart from './Cart';
import update from 'immutability-helper';
import ShoppingCart from '../images/shopping-cart.svg'
import { gql, useQuery } from '@apollo/client';
import '../styles/Products.css';
import { useEffect, useState } from 'react';
import { ProductContext } from './context';

const Products = () => {
    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [currency, setCurrency] = useState("USD");
    const [checked, setChecked] = useState(true);
    const [products, setProducts] = useState([]);
    const [totalQuantity, setTotalQuantity] = useState(0);
    const productContext = ({
        total: total,
        cartItems: cartItems,
        incrementQuantity: ({id, price})=>{
            const idx = cartItems.findIndex(obj=>obj.id === id);
            setCartItems((cartItems)=>(update(cartItems, {[idx]: {quantity: {$apply: function(x){return x + 1; }}}})));
        },
        decrementQuantity: ({id,price})=>{
            const idx = cartItems.findIndex(obj=>obj.id === id);
            if(cartItems[idx].quantity === 1){
                setCartItems((cartItems)=>(update(cartItems, {$splice: [[idx, 1]]})));
            }else{
                setCartItems((cartItems)=>(update(cartItems, {[idx]: {quantity: {$apply: function(x){return x - 1; }}}})));
            }
        },
        removeItem: ({id, price, quantity})=>{
            const idx = cartItems.findIndex(obj=>obj.id === id);
            setCartItems((cartItems)=>(update(cartItems, {$splice: [[idx, 1]]})));
        },
        currency: currency,
        changeCurrency: (newCurrency)=>{
            setCurrency(newCurrency);
            refetch();
        },
        checked: checked,
        updateCheck : (event)=>{
            setChecked(event.target.checked);
        },
        closeCart: ()=>{
            if(checked){
                setChecked(false);
            }
        },
        products: products,
    })

    const GET_PRODUCTS = gql`
        query{
                products{
                id
                title
                image_url
                price(currency: ${currency})
            }
        } 
    `
    const toggleCart = ()=>{
            setChecked((checked)=>!checked);
    }

    const { loading, error, data, refetch } = useQuery(GET_PRODUCTS);


    const calcTotal = ()=>{
        let temp = 0
        cartItems.map(({price, quantity})=>temp += price*quantity);
        setTotal(temp)
    }

    const calcQuantity = ()=>{
        let temp = 0
        cartItems.map(({quantity})=>temp += quantity);
        setTotalQuantity(temp);
    }

    useEffect(()=>{
        if(data){
            setProducts(data.products);
            cartItems.map(({id, price})=>{
                const idx = cartItems.findIndex(obj=>obj.id === id);
                const pidx = data.products.findIndex(obj=>obj.id === id);
                return setCartItems((cartItems)=>(update(cartItems, {[idx]: {price: {$set: [data.products[pidx].price]}}})));
            });
        }
    }, [data])
    //useEffect to calculate the total
    useEffect(()=>{
        calcTotal();
        calcQuantity();
    }, [cartItems]);

    const addToCart = ({id, title, image_url, price})=>{
        if(cartItems.findIndex(obj=>obj.id === id) !== -1){
            const idx = cartItems.findIndex(obj=>obj.id === id);
            //installed and imported a helper library to help with the immutabiltiy of objects in states
            setCartItems((cartItems)=>(update(cartItems, {[idx]: {quantity: {$apply: function(x){return x + 1; }}}})));
        }else{
            setCartItems(cartItems=>cartItems.concat({id, title, image_url, price, quantity: 1}))
        }  
        toggleCart();
    }
  
    return (
        <ProductContext.Provider value={productContext}>
        <div className="products-page">
            <div className="container">
                <div id="top-bg">
                    <div>
                        <h1>All Products</h1>
                        <p className="page-description">A 360&#176; Look at Lumin</p>
                    </div>
                    <div onClick={toggleCart} className="cart-icon-container">
                        <img src={ShoppingCart} alt="shopping-cart" className="cart-icon" />
                        {
                            totalQuantity>0
                            ? <p>{totalQuantity}</p>
                            : null
                        }
                    </div>
                </div>
                <div id="products-bg">
                    <div id="all-products">
                        {
                            loading
                            ? <p>Loading...</p>
                            : error
                                ? <p>Error couldn't fetch data :(</p>
                                : products.map(({ id, title, image_url, price}) => 
                                    <div key={id} className="product-container">
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
                                )
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