import React from "react";
import { useDispatch, useSelector } from "react-redux";
import PriceFilter from "../shop/shop-filter/price-filter";
import StatusFilter from "../shop/shop-filter/status-filter";
import TopRatedProducts from "../shop/shop-filter/top-rated-products";
import { handleFilterSidebarClose, handleFilterSidebarOpen } from "@/redux/features/shop-filter-slice";
import ResetButton from "../shop/shop-filter/reset-button";
import ShopSidebarFilters from "../shop/ShopSidebarFilters";

const ShopFilterOffCanvas = ({
  all_products,
  otherProps,
  right_side = false,
}) => {
  const { priceFilterValues, setCurrPage, selectedFilters, handleFilterChange } = otherProps;
  const { filterSidebar } = useSelector((state) => state.shopFilter);
  const dispatch = useDispatch();

  // max price
  const maxPrice = all_products.reduce((max, product) => {
    return product.price > max ? product.price : max;
  }, 0);

  return (
    <>
      <div
        className={`tp-filter-offcanvas-area ${
          filterSidebar ? "offcanvas-opened" : ""
        }`}
      >
        <div className="tp-filter-offcanvas-wrapper">
          <div className="tp-filter-offcanvas-close">
            <button
              type="button"
              onClick={() => dispatch(handleFilterSidebarOpen())}
              className="tp-filter-offcanvas-close-btn filter-close-btn"
            >
              <i className="fa-solid fa-xmark"></i>
              {" "}Close
            </button>
          </div>
          <div className="tp-shop-sidebar">
            {/* Price filter */}
            <PriceFilter
              priceFilterValues={priceFilterValues}
              maxPrice={maxPrice}
            />
            {/* GSM filter */}
            {/* <GsmFilter /> */}
            {/* OZ filter */}
            {/* <OzFilter /> */}
            {/* Status filter */}
            <StatusFilter setCurrPage={setCurrPage} shop_right={right_side} />
            {/* All comprehensive filters */}
            <ShopSidebarFilters 
              selected={selectedFilters} 
              onFilterChange={handleFilterChange} 
            />
            {/* Product rating */}
            <TopRatedProducts />
            {/* Reset filter */}
            <ResetButton 
              shop_right={right_side} 
              setPriceValues={priceFilterValues?.setPriceValue} 
              maxPrice={maxPrice} 
              handleFilterChange={handleFilterChange}
            />
          </div>
        </div>
      </div>

      {/* overlay start */}
      <div
        onClick={() => dispatch(handleFilterSidebarClose())}
        className={`body-overlay ${filterSidebar ? "opened" : ""}`}
      ></div>
      {/* overlay end */}
    </>
  );
};

export default ShopFilterOffCanvas;
