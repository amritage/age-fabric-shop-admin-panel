'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
// internal
import { Cart, QuickView, Wishlist } from '@/svg';
import { handleProductModal } from '@/redux/features/productModalSlice';
import { add_cart_product } from '@/redux/features/cartSlice';
import { add_to_wishlist } from '@/redux/features/wishlist-slice';

const ProductItem = ({ product }) => {
  const dispatch = useDispatch();
  
  // Debug log
  console.log('Product data:', product);
  
  // handle add product
  const handleAddProduct = (prd) => {
    dispatch(add_cart_product(prd));
  };
  
  // handle wishlist product
  const handleWishlistProduct = (prd) => {
    dispatch(add_to_wishlist(prd));
  };

  // handle modal
  const handleModal = (prd) => {
    dispatch(handleProductModal(prd));
  };

  // Get the first available image URL
  const getImageUrl = () => {
    // Check if the backend already returns full URLs
    if (product.image && product.image.startsWith('http')) {
      return product.image;
    }
    // If not, construct the URL
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (product.image) {
      return `${baseUrl}/uploads/${product.image}`;
    }
    if (product.image1) {
      return `${baseUrl}/uploads/${product.image1}`;
    }
    if (product.image2) {
      return `${baseUrl}/uploads/${product.image2}`;
    }
    return '/assets/img/product/default-product-img.jpg';
  };
  const imageUrl = getImageUrl();

  return (
    <div className="tp-product-item-2 mb-40">
      <div className="tp-product-thumb-2 p-relative z-index-1 fix">
        <Link href={`/product-details/${product._id}`}>
          <div style={{ position: 'relative', width: '100%', height: '342px' }}>
            <Image
              src={imageUrl}
              alt={product.name || "product image"}
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={(e) => {
                e.target.src = '/assets/img/product/default-product-img.jpg';
              }}
            />
          </div>
        </Link>
        <div className="tp-product-badge">
          {product.discount && <span className="product-hot">Hot</span>}
        </div>
        <div className="tp-product-action-2 tp-product-action-blackStyle">
          <div className="tp-product-action-item-2 d-flex flex-column">
            <button
              type="button"
              onClick={() => handleAddProduct(product)}
              className="tp-product-action-btn-2 tp-product-add-cart-btn"
            >
              <Cart />
              <span className="tp-product-tooltip tp-product-tooltip-right">
                Add to Cart
              </span>
            </button>
            <button
              type="button"
              onClick={() => handleWishlistProduct(product)}
              className="tp-product-action-btn-2 tp-product-add-to-wishlist-btn"
            >
              <Wishlist />
              <span className="tp-product-tooltip tp-product-tooltip-right">
                Add To Wishlist
              </span>
            </button>
            <button
              type="button"
              onClick={() => handleModal(product)}
              className="tp-product-action-btn-2 tp-product-quick-view-btn"
            >
              <QuickView />
              <span className="tp-product-tooltip tp-product-tooltip-right">
                Quick View
              </span>
            </button>
          </div>
        </div>
      </div>
      <div className="tp-product-content-2 pt-15">
        <div className="tp-product-tag-2">
          <a href="#">{product.newCategoryId?.name || 'Unknown Category'}</a>
        </div>
        <h3 className="tp-product-title-2">
          <Link href={`/product-details/${product._id}`}>{product.name}</Link>
        </h3>
        <div className="tp-product-price-wrapper-2">
          <span className="tp-product-price-2 new-price">${product.salesPrice}</span>
          {product.purchasePrice > product.salesPrice && (
            <span className="tp-product-price-2 old-price">
              ${product.purchasePrice}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
