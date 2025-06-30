// /*
import React, { useEffect } from "react";
import ReactSelect from "react-select";
import { FieldErrors, Controller, Control, FieldValues } from "react-hook-form";
import ErrorMsg from "../../common/error-msg";

// CouponFormData type (should match useCouponSubmit definition)
interface CouponFormData {
  name: string;
  code: string;
  endtime: string;
  discountpercentage: number;
  minimumamount: number;
  productType: string;
}

// prop type
type IPropType<T extends FieldValues> = {
  errors: FieldErrors<T>;
  control: Control<T, any>;
  setSelectProductType: React.Dispatch<React.SetStateAction<string>>;
  default_value?: string;
};

function ProductType<T extends FieldValues>({
  errors,
  control,
  default_value,
  setSelectProductType,
}: IPropType<T>) {
  // handleSelectProduct
  const handleSelectProduct = (value: string) => {
    setSelectProductType(value);
  };
  // set default product
  useEffect(() => {
    if (default_value) {
      setSelectProductType(default_value);
    }
  }, [default_value, setSelectProductType]);

  return (
    <>
      <Controller
        name={"productType" as any}
        control={control}
        rules={{
          required: default_value ? false : "productType is required!",
        }}
        render={({ field }) => (
          <ReactSelect
            {...field}
            value={field.value}
            defaultValue={
              default_value
                ? {
                    label: default_value,
                    value: default_value,
                  }
                : {
                    label: "Select..",
                    value: 0,
                  }
            }
            onChange={(selectedOption: { value: string; label: string } | null) => {
              field.onChange(selectedOption);
              handleSelectProduct(selectedOption?.value ?? "");
            }}
            options={[
              { value: "electronics", label: "Electronics" },
              { value: "fashion", label: "Fashion" },
              { value: "beauty", label: "Beauty" },
              { value: "jewelry", label: "Jewelry" },
            ]}
          />
        )}
      />
      <ErrorMsg msg={(errors as any)?.productType?.message as string} />
    </>
  );
}

export default ProductType;
// */
