// File: src/components/common/product-modal/index.jsx
'use client';
import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactModal from "react-modal";
import { handleModalClose } from "@/redux/features/productModalSlice";
import DetailsThumbWrapper from "@/components/product-details/details-thumb-wrapper";
import DetailsWrapper from "@/components/product-details/details-wrapper";
import { initialOrderQuantity } from "@/redux/features/cartSlice";

// Set the app element for accessibility
if (typeof window !== 'undefined') {
  ReactModal.setAppElement('body');
}

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    height: "calc(100% - 300px)",
  },
};

const ProductModal = () => {
  const dispatch = useDispatch();
  const { productItem, isModalOpen } = useSelector(
    (state) => state.productModal
  );

  // Derive imageURLs from productItem
  const imageURLs = useMemo(() => {
    if (!productItem?._id) return [];
    const list = [
      productItem.image && { img: productItem.image, type: "image" },
      productItem.image1 && { img: productItem.image1, type: "image" },
      productItem.image2 && { img: productItem.image2, type: "image" },
    ].filter(Boolean);
    if (productItem.video) {
      list.push({
        img: "/assets/img/product/-video-thumb.png",
        type: "video",
      });
    }
    return list;
  }, [productItem]);

  // Determine the main image
  const mainImg = productItem?.img || imageURLs[0]?.img || "";
  const [activeImg, setActiveImg] = useState(mainImg);

  // Update active image and reset quantity when product changes
  useEffect(() => {
    setActiveImg(mainImg);
    dispatch(initialOrderQuantity());
  }, [mainImg, dispatch]);

  const handleImageActive = (item) => {
    setActiveImg(item.img);
  };

  return (
    <ReactModal
      isOpen={isModalOpen}
      onRequestClose={() => dispatch(handleModalClose())}
      style={customStyles}
      contentLabel="Product Modal"
    >
      <button
        onClick={() => dispatch(handleModalClose())}
        type="button"
        className="tp-product-modal-close-btn"
      >
        <i className="fa-regular fa-xmark" />
      </button>
      <div className="tp-product-modal-content d-lg-flex">
        <DetailsThumbWrapper
          activeImg={activeImg}
          handleImageActive={handleImageActive}
          imageURLs={imageURLs}
          imgWidth={400}
          imgHeight={400}
          status={productItem?.status}
          videoId={productItem?.video}
        />
        <DetailsWrapper
          productItem={productItem}
          handleImageActive={handleImageActive}
          activeImg={activeImg}
        />
      </div>
    </ReactModal>
  );
};

export default ProductModal;
