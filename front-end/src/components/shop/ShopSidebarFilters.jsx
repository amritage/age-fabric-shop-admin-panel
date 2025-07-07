import React, { useState } from 'react';


const FILTERS = [
  { key: 'category', label: 'Category', api: `${process.env.NEXT_PUBLIC_API_BASE_URL}/newcategory/viewcategory` },
  { key: 'color', label: 'Color', api: `${process.env.NEXT_PUBLIC_API_BASE_URL}/color/view` },
  { key: 'content', label: 'Content', api: `${process.env.NEXT_PUBLIC_API_BASE_URL}/content/viewcontent` },
  { key: 'design', label: 'Design', api: `${process.env.NEXT_PUBLIC_API_BASE_URL}/design/view` },
  { key: 'structure', label: 'Structure', api: `${process.env.NEXT_PUBLIC_API_BASE_URL}/structure/view`, sub: { key: 'substructure', label: 'Substructure', api: `${process.env.NEXT_PUBLIC_API_BASE_URL}/substructure/view` } },
  { key: 'finish', label: 'Finish', api: `${process.env.NEXT_PUBLIC_API_BASE_URL}/finish/view`, sub: { key: 'subfinish', label: 'Subfinish', api: `${process.env.NEXT_PUBLIC_API_BASE_URL}/subfinish/view` } },
  { key: 'groupcode', label: 'Groupcode', api: `${process.env.NEXT_PUBLIC_API_BASE_URL}/groupcode/view` },
  { key: 'vendor', label: 'Vendor', api: `${process.env.NEXT_PUBLIC_API_BASE_URL}/vendor/view` },
  { key: 'suitablefor', label: 'Suitable For', api: `${process.env.NEXT_PUBLIC_API_BASE_URL}/suitablefor/view`, sub: { key: 'subsuitable', label: 'Sub Suitable For', api: `${process.env.NEXT_PUBLIC_API_BASE_URL}/subsuitable/view` } },
  { key: 'motifsize', label: 'Motifsize', api: `${process.env.NEXT_PUBLIC_API_BASE_URL}/motifsize/view` },
];

const fetchOptions = async (api) => {
  const res = await fetch(api);
  if (!res.ok) return [];
  const data = await res.json();
  // Try to find the array in the response
  return data.result || data.data || data || [];
};

const ShopSidebarFilters = ({ onFilterChange, selected }) => {
  const [openKey, setOpenKey] = useState(null);
  const [options, setOptions] = useState({});

  const handleAccordion = async (key, api) => {
    setOpenKey(key === openKey ? null : key);
    if (!options[key]) {
      const opts = await fetchOptions(api);
      setOptions((prev) => ({ ...prev, [key]: opts }));
    }
  };

  const handleCheckboxSelect = (filterKey, value) => {
    const currentValues = selected[filterKey] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];
    const updated = { ...selected, [filterKey]: newValues };
    onFilterChange(updated);
  };

  // For sub-filters
  const handleSubAccordion = async (parentKey, subKey, api) => {
    if (!options[subKey]) {
      const opts = await fetchOptions(api);
      setOptions((prev) => ({ ...prev, [subKey]: opts }));
    }
  };

  return (
    <div className="tp-shop-sidebar mr-10">
      <h3 className="tp-shop-widget-title">Filter</h3>
      <div className="tp-shop-widget-content">
        {FILTERS.map((filter) => (
          <div key={filter.key} className="tp-shop-widget mb-30">
            <div
              className="tp-shop-widget-title no-border d-flex justify-content-between align-items-center"
              style={{ cursor: 'pointer' }}
              onClick={() => handleAccordion(filter.key, filter.api)}
            >
              <span>{filter.label}</span>
              <span>{openKey === filter.key ? '-' : '+'}</span>
            </div>
            {openKey === filter.key && (
              <div className="tp-shop-widget-options mt-2">
                <div className="d-flex flex-column">
                  {options[filter.key]?.map((opt) => (
                    <label key={opt._id || opt.id || opt.name} style={{ cursor: 'pointer', marginBottom: '5px' }}>
                      <input
                        type="checkbox"
                        name={filter.key}
                        checked={(selected[filter.key] || []).includes(opt._id || opt.id || opt.name)}
                        onChange={() => handleCheckboxSelect(filter.key, opt._id || opt.id || opt.name)}
                        style={{ marginRight: '8px' }}
                      />
                      {opt.name || opt.parent || opt.title}
                    </label>
                  ))}
                </div>
                {/* Sub-filter */}
                {filter.sub && (
                  <div className="tp-shop-widget-subfilter mt-2">
                    <div
                      className="tp-shop-widget-title no-border d-flex justify-content-between align-items-center"
                      style={{ cursor: 'pointer', fontSize: '0.95em' }}
                      onClick={() => handleSubAccordion(filter.key, filter.sub.key, filter.sub.api)}
                    >
                      <span>{filter.sub.label}</span>
                      <span>{options[filter.sub.key] ? '-' : '+'}</span>
                    </div>
                    {options[filter.sub.key] && (
                      <div className="d-flex flex-column">
                        {options[filter.sub.key]?.map((opt) => (
                          <label key={opt._id || opt.id || opt.name} style={{ cursor: 'pointer', marginBottom: '5px' }}>
                            <input
                              type="checkbox"
                              name={filter.sub.key}
                              checked={(selected[filter.sub.key] || []).includes(opt._id || opt.id || opt.name)}
                              onChange={() => handleCheckboxSelect(filter.sub.key, opt._id || opt.id || opt.name)}
                              style={{ marginRight: '8px' }}
                            />
                            {opt.name || opt.parent || opt.title}
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShopSidebarFilters; 