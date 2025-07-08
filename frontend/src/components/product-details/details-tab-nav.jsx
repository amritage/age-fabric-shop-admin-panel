'use client';
import React, { useRef, useEffect } from 'react';
import { useGetStructureQuery } from '@/redux/features/structureApi';
import { useGetContentByIdQuery } from '@/redux/features/contentApi';
import { useGetFinishByIdQuery } from '@/redux/features/finishApi';
import { useGetDesignByIdQuery } from '@/redux/features/designApi';
import { useGetMotifSizeByIdQuery } from '@/redux/features/motifSizeApi';
import { useGetSuitableForByIdQuery } from '@/redux/features/suitableForApi';

const DetailsTabNav = ({ product }) => {
  const {
    description,
    oz, productIdentifier,
    structureId, contentId, finishId, designId, motifsizeId, suitableforId
  } = product || {};
  
  const activeRef = useRef(null)
  const marker = useRef(null);

  const { data: structureData } = useGetStructureQuery(structureId, { skip: !structureId });
  const { data: contentData } = useGetContentByIdQuery(contentId, { skip: !contentId });
  const { data: finishData } = useGetFinishByIdQuery(finishId, { skip: !finishId });
  const { data: designData } = useGetDesignByIdQuery(designId, { skip: !designId });
  const { data: motifsizeData } = useGetMotifSizeByIdQuery(motifsizeId, { skip: !motifsizeId });
  const { data: suitableforData } = useGetSuitableForByIdQuery(suitableforId, { skip: !suitableforId });

  const infoItems = [
    { label: "Structure", value: structureData?.data?.name },
    { label: "Content", value: contentData?.data?.name },
    { label: "Finish", value: finishData?.data?.name },
    { label: "Design", value: designData?.data?.name },
    { label: "Motif Size", value: motifsizeData?.data?.name },
    { label: "Suitable For", value: suitableforData?.data?.name },
    { label: "OZ", value: oz },
    { label: "Product ID", value: productIdentifier },
  ].filter(item => item.value);

  const half = Math.ceil(infoItems.length / 2);
  const firstHalf = infoItems.slice(0, half);
  const secondHalf = infoItems.slice(half);

  const handleActive = (e) => {
    if (e.target.classList.contains('active')) {
      marker.current.style.left = e.target.offsetLeft + "px";
      marker.current.style.width = e.target.offsetWidth + "px";
    }
  }
  useEffect(() => {
    if (activeRef.current?.classList.contains('active')) {
      marker.current.style.left = activeRef.current.offsetLeft + 'px';
      marker.current.style.width = activeRef.current.offsetWidth + 'px';
    }
  }, []);

  function NavItem({ active = false, id, title, linkRef }) {
    return (
      <button
        ref={linkRef}
        className={`nav-link ${active ? "active" : ""}`}
        id={`nav-${id}-tab`}
        data-bs-toggle="tab"
        data-bs-target={`#nav-${id}`}
        type="button"
        role="tab"
        aria-controls={`nav-${id}`}
        aria-selected={active ? "true" : "false"}
        tabIndex="-1"
        onClick={e => handleActive(e)}
      >
        {title}
      </button>
    );
  }

  return (
    <>
      <div className="tp-product-details-tab-nav tp-tab">
        <nav>
          <div className="nav nav-tabs justify-content-center p-relative tp-product-tab" id="navPresentationTab" role="tablist">
            <NavItem active={true} linkRef={activeRef} id="desc" title="Description" />
            <NavItem id="additional" title="Additional information" />
            <span ref={marker} id="productTabMarker" className="tp-product-details-tab-line"></span>
          </div>
        </nav>
        <div className="tab-content" id="navPresentationTabContent">
          <div className="tab-pane fade show active" id="nav-desc" role="tabpanel" aria-labelledby="nav-desc-tab" tabIndex="-1">
            <div className="tp-product-details-desc-wrapper pt-60">
              <p>{description}</p>
            </div>
          </div>
          <div className="tab-pane fade" id="nav-additional" role="tabpanel" aria-labelledby="nav-additional-tab" tabIndex="-1">
            <div className="tp-product-details-additional-info ">
              <div className="row">
                <div className="col-xl-6">
                  <table>
                    <tbody>
                      {firstHalf.map((item, i) => (
                        <tr key={i}>
                          <td>{item.label}</td>
                          <td>{item.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="col-xl-6">
                  <table>
                    <tbody>
                      {secondHalf.map((item, i) => (
                        <tr key={i}>
                          <td>{item.label}</td>
                          <td>{item.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DetailsTabNav;