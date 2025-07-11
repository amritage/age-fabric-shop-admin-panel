import React from "react";
import ReactSelect, { SingleValue } from "react-select";

// type
type IPropType = {
  handleChange: (value: string | undefined) => void;
};

const BrandStatus = ({ handleChange }: IPropType) => {
  return (
    <div className="mb-5">
      <p className="mb-0 text-base text-black">Status</p>
      <ReactSelect
        onChange={(value: SingleValue<{ value: string; label: string }>) => handleChange(value?.value)}
        options={[
          { value: "active", label: "Active" },
          { value: "inactive", label: "Inactive" },
        ]}
      />
    </div>
  );
};

export default BrandStatus;
