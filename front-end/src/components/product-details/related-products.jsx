/* eslint-disable no-unused-vars */
'use client';
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import {  Navigation,Autoplay } from "swiper/modules";
// internal
import { useGetGroupCodeProductsQuery } from "@/redux/features/newProductApi";
import ProductItem from "../products/fashion/product-item";
import ErrorMsg from "../common/error-msg";
import { HomeNewArrivalPrdLoader } from "../loader";

// slider setting
const slider_setting = {
  slidesPerView: 4,
  spaceBetween: 24,
  navigation: {
    nextEl: ".tp-related-slider-button-next",
    prevEl: ".tp-related-slider-button-prev",
  },
  autoplay: {
    delay: 5000,
  },
  breakpoints: {
    1200: {
      slidesPerView: 4,
    },
    992: {
      slidesPerView: 3,
    },
    768: {
      slidesPerView: 2,
    },
    576: {
      slidesPerView: 2,
    },
    0: {
      slidesPerView: 1,
    },
  },
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const RelatedProducts = ({id, groupcodeId}) => {
  const { data, isError, isLoading } = useGetGroupCodeProductsQuery(groupcodeId, { 
    skip: !groupcodeId 
  });
  // decide what to render
  let content = null;

  if (!groupcodeId) {
    content = <ErrorMsg msg="No group code available for related products" />;
  } else if (isLoading) {
    content = <HomeNewArrivalPrdLoader loading={isLoading}/>;
  } else if (!isLoading && isError) {
    content = <ErrorMsg msg="There was an error" />;
  } else if (!isLoading && !isError && (!data || !data.data || data.data.length === 0)) {
    content = <ErrorMsg msg="No Products found!" />;
  } else if (!isLoading && !isError && data && data.data && data.data.length > 0) {
    const product_items = data.data;
    content = (
      <Swiper
        {...slider_setting}
        modules={[Autoplay, Navigation]}
        className="tp-product-related-slider-active swiper-container mb-10"
      >
        {product_items.slice(0,6).map((item) => (
          <SwiperSlide key={item._id}>
            <ProductItem product={item} primary_style={true} />
          </SwiperSlide>
        ))}
      </Swiper>
    );
  }
  return (
    <div className="tp-product-related-slider">
      {content}
    </div>
  );
};

export default RelatedProducts;
