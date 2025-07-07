'use client';
// external
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Scrollbar } from "swiper/modules";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
// internal
import { TextShapeLine } from "@/svg";
import ErrorMsg from "@/components/common/error-msg";
import { useGetPopularNewProductsQuery } from "@/redux/features/newProductApi";
import { add_cart_product } from "@/redux/features/cartSlice";
import { HomeTwoPopularPrdLoader } from "@/components/loader";
import { notifyError } from "@/utils/toast";

// slider setting
const slider_setting = {
  slidesPerView: 5,
  spaceBetween: 20,
  loop: false,
  centeredSlides: false,
  scrollbar: {
    el: ".swiper-scrollbar",
    draggable: true,
    dragClass: "tp-swiper-scrollbar-drag",
    snapOnRelease: true,
  },
  breakpoints: {
    1200: {
      slidesPerView: 5,
    },
    992: {
      slidesPerView: 4,
    },
    768: {
      slidesPerView: 3,
    },
    576: {
      slidesPerView: 2,
    },
    0: {
      slidesPerView: 1,
    },
  },
};

function getFixedImageUrl(url) {
  if (!url) return '/assets/img/product/product-1.jpg'; // Default fallback image
  // If it's already a full URL, return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    // Fix the specific case where localhost is missing port number
    if (url.startsWith('http://localhost:/')) {
      return url.replace('http://localhost:/', 'http://localhost:7000/');
    }
    return url;
  }
  // If it's a relative path starting with uploadimage, construct full URL
  if (url.startsWith('uploadimage/')) {
    return `${process.env.NEXT_PUBLIC_API_BASE_URL}/${url}`;   
  }
  // If it's just a filename, assume it's in uploadimage folder
  if (!url.includes('/')) {
    return `${process.env.NEXT_PUBLIC_API_BASE_URL}/uploadimage/${url}`;
  }
  // For any other case, try to construct the URL
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  return `${baseUrl}`;
}

const PopularProducts = () => {
  const {data: products, isError, isLoading} = useGetPopularNewProductsQuery();
  const { cart_products } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  // handle add product
  const handleAddProduct = (prd) => {
    if(prd.status === 'out-of-stock'){
      notifyError(`This product out-of-stock`)
    }
    else {
      dispatch(add_cart_product(prd));
    }
  };
  // decide what to render
  let content = null;

  if (isLoading) {
    content = <HomeTwoPopularPrdLoader loading={isLoading}/>;
  }
  if (!isLoading && isError) {
    content = <ErrorMsg msg="There was an error" />;
  }
  if (!isLoading && !isError && products?.data?.length === 0) {
    content = <ErrorMsg msg="No Products found!" />;
  }
  if (!isLoading && !isError && products?.data?.length > 0) {
    const product_items = products.data;

    content = (
      <Swiper
        {...slider_setting}
        modules={[Scrollbar]}
        className="tp-category-slider-active-2 swiper-container mb-50"
      >
        {product_items.map((item) => {
          const imageUrl = getFixedImageUrl(item.image);
          console.log('Popular Product:', item.name, 'Image URL:', imageUrl);
          
          return (
            <SwiperSlide
              key={item._id}
              className="tp-category-item-2 p-relative z-index-1 text-center"
            >
              <div className="tp-category-thumb-2">
                <Link href={`/product-details/${item._id}`}>
                  <Image
                    src={imageUrl}
                    alt={item.name || "product-img"}
                    width={224}
                    height={260}
                    onError={(e) => {
                      e.target.src = '/assets/img/product/product-1.jpg';
                    }}
                  />
                </Link>
              </div>
              <div className="tp-category-content-2">
                <span>From ${item.salesPrice || item.purchasePrice || 0}</span>
                <h3 className="tp-category-title-2">
                  <Link href={`/product-details/${item._id}`}>
                    {item.name ? item.name.substring(0, 15) : 'Product Name'}
                  </Link>
                </h3>
                <div className="tp-category-btn-2">
                  {cart_products.some((prd) => prd._id === item._id) ? (
                    <Link
                      href="/cart"
                      className="tp-btn tp-btn-border cursor-pointer"
                    >
                      View Cart
                    </Link>
                  ) : (
                    <a
                      onClick={() => handleAddProduct(item)}
                      className="tp-btn tp-btn-border cursor-pointer"
                    >
                      Add to Cart
                    </a>
                  )}
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    );
  }
  return (
    <>
      <section className="tp-category-area pb-95 pt-95">
        <div className="container">
          <div className="row">
            <div className="col-xl-12">
              <div className="tp-section-title-wrapper-2 text-center mb-50">
                <span className="tp-section-title-pre-2">
                  Shop by Popular
                  <TextShapeLine />
                </span>
                <h3 className="tp-section-title-2">
                  Popular on the Shofy store.
                </h3>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xl-12">
              <div className="tp-category-slider-2 p-relative">
                {content}
                <div className="swiper-scrollbar tp-swiper-scrollbar tp-swiper-scrollbar-drag"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default PopularProducts;
