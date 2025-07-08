'use client';
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { Rating } from 'react-simple-star-rating';
import Link from 'next/link';
// internal
import { useGetTopRatedQuery } from '@/redux/features/newProductApi';
import { ArrowRightLong, NextLongArr, PrevLongArr, TextShapeLine } from '@/svg';
import ErrorMsg from '@/components/common/error-msg';
import { HomeTwoFeaturedPrdLoader } from '@/components/loader';

// slider setting 
const slider_setting = {
  slidesPerView: 3,
  spaceBetween: 10,
  navigation: {
    nextEl: ".tp-featured-slider-button-next",
    prevEl: ".tp-featured-slider-button-prev",
  },
  breakpoints: {
    '1200': {
      slidesPerView: 3,
    },
    '992': {
      slidesPerView: 3,
    },
    '768': {
      slidesPerView: 2,
    },
    '576': {
      slidesPerView: 1,
    },
    '0': {
      slidesPerView: 1,
    },
  }
}

const getImageUrl = (item) => {
  if (item.image && item.image.startsWith('http')) return item.image;
  if (item.image1 && item.image1.startsWith('http')) return item.image1;
  if (item.image2 && item.image2.startsWith('http')) return item.image2;
  return '/assets/img/product/default-product-img.jpg';
};

const WeeksFeatured = () => {
  const { data: products, isError, isLoading } = useGetTopRatedQuery();
  // decide what to render
  let content = null;

  if (isLoading) {
    content = (
      <HomeTwoFeaturedPrdLoader loading={isLoading} />
    );
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
      <Swiper {...slider_setting} modules={[Navigation]} className="tp-featured-slider-active swiper-container">
        {product_items.map((item) => {
          return (
            <SwiperSlide key={item._id} className="tp-featured-item white-bg p-relative z-index-1">
              <div className="tp-featured-thumb include-bg" style={{ backgroundImage: `url(${getImageUrl(item)})` }} data-background="assets/img/product/slider/product-slider-1.jpg"></div>
              <div className="tp-featured-content">
                <h3 className="tp-featured-title">
                  <Link href={`/product-details/${item._id}`}>{item.title}</Link>
                </h3>
                <div className="tp-featured-price-wrapper">
                  {item.discount > 0 ? (
                    <>
                      <span className="tp-featured-price new-price">${item.price}</span>
                      <span className="tp-featured-price old-price">
                        {" "} $ {(Number(item.price) - (Number(item.price) * Number(item.discount)) / 100).toFixed(2)}
                      </span>
                    </>
                  ) : (
                    <span className="tp-featured-price new-price">${item.price}</span>
                  )}
                </div>
                <div className="tp-product-rating-icon tp-product-rating-icon-2">
                  <Rating allowFraction size={16} initialValue={item.reviews && item.reviews.length > 0 ? item.reviews.reduce((acc, review) => acc + review.rating, 0) / item.reviews.length : 0} readonly={true} />
                </div>
                <div className="tp-featured-btn">
                  <Link href={`/product-details/${item._id}`} className="tp-btn tp-btn-border tp-btn-border-sm">Shop Now
                    {" "}<ArrowRightLong />
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          )
        })}
      </Swiper>
    )
  }
  return (
    <section className="tp-featured-slider-area grey-bg-6 fix pt-95 pb-120">
      <div className="container">
        <div className="row">
          <div className="col-xl-12">
            <div className="tp-section-title-wrapper-2 mb-50">
              <span className="tp-section-title-pre-2">
                Shop by Featured
                <TextShapeLine />
              </span>
              <h3 className="tp-section-title-2">This {"Week's"} Featured</h3>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-xl-12">
            <div className="tp-featured-slider">
              {content}
              <div className="tp-featured-slider-arrow mt-45">
                <button className="tp-featured-slider-button-prev">
                  <PrevLongArr />
                </button>
                <button className="tp-featured-slider-button-next">
                  <NextLongArr />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WeeksFeatured;