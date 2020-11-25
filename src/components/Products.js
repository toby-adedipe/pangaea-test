import React from 'react';
import { gql, useQuery } from '@apollo/client';
import '../styles/Products.css';
const PRODUCTS_DATA = gql`
    query{
        products{
        id,
        title,
        image_url,
        price(currency: USD)
        }
    }
`
const Products = () => {
    const { loading, error, data } = useQuery(PRODUCTS_DATA);
    const currency = "USD";

    return (
        <div className="products-page">
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
                                        <button className="cart-btn"> Add to Cart </button>
                                    </div>
                                </div>
                            ))
                            
                    }
                </div>
            </div>
        </div>
    );
};

export default Products;