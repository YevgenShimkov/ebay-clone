"use client"

import MainLayout from './layouts/MainLayout'
import CarouselComp from "@/app/components/CarouselComp";
import ProductItem from "@/app/components/product/ProductItem";
import { useEffect, useState } from "react";
import useIsLoading from "@/app/hooks/useIsLoading";

export default function Home() {
  const [products,setProducts] = useState([])
  
  const getProducts = async () => {
    useIsLoading(true)
    
    const response = await fetch('/api/products')
    const prods = await response.json()
    
    setProducts(prods)
    useIsLoading(false)
  }
  
  useEffect(() => {
    getProducts()
  }, []);
  
  return (
    <MainLayout>
      <CarouselComp/>
      
      <div className="max-w-[1200px] mx-auto">
        <div className="text-2xl font-bold mt-4 mb-6 px-4">
          Products
        </div>
        <div className="grid grid-cols-5 gap-4">
          {products.map((product) => <ProductItem key={product.id} product={product}/>)}
        </div>
      </div>
    </MainLayout>
  )
}
