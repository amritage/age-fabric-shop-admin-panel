// File: app/fabric-products/edit/[id]/page.tsx
import React from "react";
import Wrapper from "@/layout/wrapper";
import AddProductForm from "@/app/components/fabric-products/add-product-form";

interface Props {
  params: { id: string };
}

export default function EditProductPage({ params }: Props) {
  return (
    <Wrapper>
      <AddProductForm productId={params.id} />
    </Wrapper>
  );
}
