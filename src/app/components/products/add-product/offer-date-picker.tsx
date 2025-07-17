import React from "react";
import Datepicker from "react-tailwindcss-datepicker";

type IPropType = {
  offerDate: {
    startDate: Date | null;
    endDate: Date | null;
  };
  setOfferDate: React.Dispatch<
    React.SetStateAction<{
      startDate: Date | null;
      endDate: Date | null;
    }>
  >;
  defaultValue?: {
    startDate: string | null;
    endDate: string | null;
  };
  isRange?: boolean;
};

const OfferDatePicker = ({
  offerDate,
  setOfferDate,
  defaultValue,
  isRange = true,
}: IPropType) => {
  const handleValueChange = (newValue: any) => {
    setOfferDate(newValue);
  };

  // Convert defaultValue strings to Date objects if present
  const datePickerValue = defaultValue
    ? {
        startDate: defaultValue.startDate ? new Date(defaultValue.startDate) : null,
        endDate: defaultValue.endDate ? new Date(defaultValue.endDate) : null,
      }
    : offerDate;

  return (
    <Datepicker
      useRange={isRange}
      inputClassName="input w-full h-[44px] rounded-md border border-gray6 px-6 text-base"
      value={datePickerValue}
      onChange={handleValueChange}
    />
  );
};

export default OfferDatePicker;
