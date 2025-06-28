'use client';
import React from "react";
// const PrdDetailsLoader = ... // Commented out because it is defined but never used
import ErrorMsg from "../common/error-msg";
import ProductDetailsBreadcrumb from "../breadcrumb/product-details-breadcrumb";
import ProductDetailsContent from "./product-details-content";

const ProductDetailsArea = ({ product }) => {
  if (!product) {
    return <ErrorMsg msg="No product found!" />;
  }
  return (
    <>
      <ProductDetailsBreadcrumb category={product.category.name} title={product.title} />
      <ProductDetailsContent productItem={product} />
    </>
  );
};

export default ProductDetailsArea;
