/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetStructureQuery } from '@/redux/features/structureApi';
import { useGetContentByIdQuery } from '@/redux/features/contentApi';
import { useGetFinishByIdQuery } from '@/redux/features/finishApi';
import { add_cart_product } from '@/redux/features/cartSlice';
import { add_to_wishlist } from '@/redux/features/wishlist-slice';
import { add_to_compare } from '@/redux/features/compareSlice';

// internal
// Define a separate, dedicated component for each piece of information.
const StructureInfo = ({ id }) => {
  if (!id) return null;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { data, isLoading, isError } = useGetStructureQuery(id);
  const value = isLoading ? 'Loading...' : (isError || !data?.data?.name) ? 'N/A' : data.data.name;
  return (<div className="tp-product-details-query-item d-flex align-items-center"><span>Structure: </span><p>{value}</p></div>);
};
const ContentInfo = ({ id }) => {
  if (!id) return null;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { data, isLoading, isError } = useGetContentByIdQuery(id);
  const value = isLoading ? 'Loading...' : (isError || !data?.data?.name) ? 'N/A' : data.data.name;
  return (<div className="tp-product-details-query-item d-flex align-items-center"><span>Content: </span><p>{value}</p></div>);
};
const FinishInfo = ({ id }) => {
  if (!id) return null;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { data, isLoading, isError } = useGetFinishByIdQuery(id);
  const value = isLoading ? 'Loading...' : (isError || !data?.data?.name) ? 'N/A' : data.data.name;
  return (<div className="tp-product-details-query-item d-flex align-items-center"><span>Finish: </span><p>{value}</p></div>);
};

const DetailsWrapper = ({ productItem }) => {
  const { 
    _id, sku, title, category, newCategoryId, description, status, price, discount, 
    structureId, contentId, finishId, gsm, width 
  } = productItem || {};
  
  const dispatch = useDispatch();
  const { wishlist } = useSelector((state) => state.wishlist);
  const isAddedToWishlist = wishlist.some((prd) => prd._id === _id);

  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const handleAddProduct = (prd) => {
    dispatch(add_cart_product(prd));
  };

  const handleWishlistProduct = (prd) => {
    dispatch(add_to_wishlist(prd));
  };

  // eslint-disable-next-line no-unused-vars
  const handleCompareProduct = (prd) => {
    dispatch(add_to_compare(prd));
  };
  return (
    <div className="tp-product-details-wrapper">
      <div className="tp-product-details-category">
        <span>{category?.name || newCategoryId?.name}</span>
      </div>
      <h3 className="tp-product-details-title">{title}</h3>

      <div className="tp-product-details-inventory d-flex align-items-center mb-10">
        <div className="tp-product-details-stock mb-10">
          <span>{status}</span>
        </div>
      </div>
      <p>{description}</p>

      <div className="tp-product-details-price-wrapper mb-20">
        {discount > 0 ? (
          <>
            <span className="tp-product-details-price old-price">${price}</span>
            <span className="tp-product-details-price new-price">
              {" $"}{(Number(price) - (Number(price) * Number(discount)) / 100).toFixed(2)}
            </span>
          </>
        ) : (
          <span className="tp-product-details-price new-price">${(price || 0).toFixed(2)}</span>
        )}
      </div>

      {/* Product Information */}
      <div className="tp-product-details-query" style={{marginBottom: '20px'}}>
        <div className="tp-product-details-query-item d-flex align-items-center">
          <span>SKU: </span>
          <p>{sku}</p>
        </div>
        <StructureInfo id={structureId} />
        <ContentInfo id={contentId} />
        <div className="tp-product-details-query-item d-flex align-items-center">
          <span>GSM: </span>
          <p>{gsm}</p>
        </div>
        <div className="tp-product-details-query-item d-flex align-items-center">
          <span>Width: </span>
          <p>{width}</p>
        </div>
        <FinishInfo id={finishId} />
      </div>

      {/* actions */}
       <div className="tp-product-details-action-wrapper">
        <div className="tp-product-details-action-item-wrapper d-flex align-items-center" style={{gap: '10px'}}>
          <div className="d-flex" style={{ flexGrow: 1, gap: '10px' }}>
            <button className="tp-product-details-buy-now-btn w-100 py-1 px-1 text-sm rounded transition-all">Request Sample</button>
            <button className="tp-product-details-buy-now-btn w-100 py-1 px- text-sm rounded transition-all">Request Quote</button>
          </div>
          <div>
            <button 
              type="button" 
              onClick={() => handleWishlistProduct(productItem)} 
              className={`tp-product-details-wishlist-btn tp-details-btn-hover ${isAddedToWishlist ? "active" : ""}`}
              aria-label="Add to Wishlist"
              style={{ 
                backgroundColor: '#fff', 
                border: '1px solid #E4E8EB',
                borderRadius: '50%',
                padding: '8px',
                lineHeight: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 24,
                color: isAddedToWishlist ? 'red' : '#bbb',
                transition: 'color 0.2s, background 0.2s',
                boxShadow: isAddedToWishlist ? '0 0 8px rgba(255,0,0,0.15)' : 'none',
                cursor: 'pointer'
              }}
              onMouseOver={e => e.currentTarget.style.color = 'red'}
              onMouseOut={e => e.currentTarget.style.color = isAddedToWishlist ? 'red' : '#bbb'}
            >
              <i className={isAddedToWishlist ? 'fas fa-heart' : 'far fa-heart'}></i>
            </button>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default DetailsWrapper;