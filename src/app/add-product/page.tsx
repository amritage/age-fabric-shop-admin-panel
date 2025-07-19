import Wrapper from "@/layout/wrapper";
import Breadcrumb from "../components/breadcrumb/breadcrumb";
import AddProductForm from "../components/fabric-products/add-product-form";

const AddProductPage = () => {
  return (
    <Wrapper>
      <div className="body-content px-8 py-8 bg-slate-100">
        {/* breadcrumb start */}
        <Breadcrumb title="Add Fabric Product" subtitle="Add Product" />
        {/* breadcrumb end */}

        {/* add a product start */}
        <AddProductForm />
        {/* add a product end */}
      </div>
    </Wrapper>
  );
};

export default AddProductPage;
