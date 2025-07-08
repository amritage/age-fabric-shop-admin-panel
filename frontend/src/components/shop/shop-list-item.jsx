'use client';
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Image from "next/image";
import { Rating } from "react-simple-star-rating";
import Link from "next/link";
// internal
import { CompareThree, QuickView, Wishlist } from "@/svg";
import { handleProductModal } from "@/redux/features/productModalSlice";
import { add_cart_product } from "@/redux/features/cartSlice";
import { add_to_wishlist } from "@/redux/features/wishlist-slice";
import { add_to_compare } from "@/redux/features/compareSlice";

const ShopListItem = ({ product }) => {
  const { _id, img, image, title, reviews, price, discount, tags, description } = product || {};
  const dispatch = useDispatch()
  const [ratingVal, setRatingVal] = useState(0);
  useEffect(() => {
    if (reviews && reviews.length > 0) {
      const rating =
        reviews.reduce((acc, review) => acc + review.rating, 0) /
        reviews.length;
      setRatingVal(rating);
    } else {
      setRatingVal(0);
    }
  }, [reviews]);

  // handle add product
  const handleAddProduct = (prd) => {
    dispatch(add_cart_product(prd));
  };
  // handle wishlist product
  const handleWishlistProduct = (prd) => {
    dispatch(add_to_wishlist(prd));
  };

  // handle compare product
  const handleCompareProduct = (prd) => {
    dispatch(add_to_compare(prd));
  };

  // Get the image URL
  const getImageUrl = (image) => {
    if (!image) {
      return '/assets/img/product/default-product-img.jpg';
    }
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      // If image is a stringified object, return default
      if (typeof image === 'string' && image.startsWith('[object Object]')) {
        return '/assets/img/product/default-product-img.jpg';
      }
      // If image is an object
      if (typeof image === 'object' && image !== null) {
        // If it has a url property
        if (image.url) {
          return image.url;
        }
        // If it has a filename or path property
        if (image.filename) {
          return `${baseUrl}/uploads/${image.filename}`;
        }
        if (image.path) {
          const cleanPath = image.path.replace(/^\/+/, '');
          return `${baseUrl}/uploads/${cleanPath}`;
        }
        return '/assets/img/product/default-product-img.jpg';
      }
      // If image starts with http or https, use it as is
      if (typeof image === 'string' && (image.startsWith('http://') || image.startsWith('https://'))) {
        return image;
      }
      // For string paths, construct the URL
      if (typeof image === 'string') {
        const cleanImagePath = image.replace(/^\/+/, '');
        return `${baseUrl}/uploads/${cleanImagePath}`;
      }
      return '/assets/img/product/default-product-img.jpg';
    } catch (error) {
      console.error('Error processing image URL:', error);
      return '/assets/img/product/default-product-img.jpg';
    }
  };
  // Get the final image URL (try both img and image props)
  const imageUrl = getImageUrl(img || image);

  return (
    <div className="tp-product-list-item d-md-flex">
      <div className="tp-product-list-thumb p-relative fix">
        <Link href={`/product-details/${_id}`}>
          {imageUrl && (
            <Image 
              src={imageUrl} 
              alt={title || "product image"} 
              width={350} 
              height={310}
              style={{ color: 'transparent' }}
              onError={(e) => {
                e.target.src = '/assets/img/product/default-product-img.jpg';
              }}
            />
          )}
        </Link>

        {/* <!-- product action --> */}
        <div className="tp-product-action-2 tp-product-action-blackStyle">
          <div className="tp-product-action-item-2 d-flex flex-column">
            <button
              type="button"
              className="tp-product-action-btn-2 tp-product-quick-view-btn"
              onClick={() => dispatch(handleProductModal(product))}
            >
              <QuickView />
              <span className="tp-product-tooltip tp-product-tooltip-right">
                Quick View
              </span>
            </button>
            <button
              type="button"
              onClick={()=> handleWishlistProduct(product)}
              className="tp-product-action-btn-2 tp-product-add-to-wishlist-btn hover:text-sky-500 focus:text-sky-500 active:text-sky-500 transition-colors"
            >
              <Wishlist />
              <span className="tp-product-tooltip tp-product-tooltip-right">
                Add To Wishlist
              </span>
            </button>
            <button
              type="button"
              onClick={()=> handleCompareProduct(product)}
              className="tp-product-action-btn-2 tp-product-add-to-compare-btn"
            >
              <CompareThree />
              <span className="tp-product-tooltip tp-product-tooltip-right">
                Add To Compare
              </span>
            </button>
          </div>
        </div>
      </div>
      <div className="tp-product-list-content">
        <div className="tp-product-content-2 pt-15">
          <div className="tp-product-tag-2">
            {tags?.map((t, i) => <a key={i} href="#">{t}</a>)}
          </div>
          <h3 className="tp-product-title-2">
            <Link href={`/product-details/${_id}`}>{title}</Link>
          </h3>
          <div className="tp-product-rating-icon tp-product-rating-icon-2">
            <Rating allowFraction size={16} initialValue={ratingVal} readonly={true} />
          </div>
          <div className="tp-product-price-wrapper-2">
            {discount > 0 ? (
              <>
                <span className="tp-product-price-2 new-price">${price}</span>
                <span className="tp-product-price-2 old-price">
                  {" "} ${(Number(price) - (Number(price) * Number(discount)) / 100).toFixed(2)}
                </span>
              </>
            ) : (
              <span className="tp-product-price-2 new-price">${price}</span>
            )}
          </div>
          <p>
            {description?.substring(0, 100)}
          </p>
          <div className="tp-product-list-add-to-cart">
            <button onClick={() => handleAddProduct(product)} className="tp-product-list-add-to-cart-btn">
              Add To Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopListItem;
