'use client'

import MainLayout from "@/app/layouts/MainLayout";
import SimilarProducts from "@/app/components/SimilarProducts";
import { useCart } from "@/app/context/cart";
import { useEffect, useState } from "react";
import useIsLoading from "@/app/hooks/useIsLoading";
import { toast } from "react-toastify";

const Product = ({ params }) => {
  
  const cart = useCart();
  
  const [product, setProduct] = useState({})
  
  const getProduct = async () => {
    console.log('fetch')
    useIsLoading(true)
    const response = await fetch(`/api/product/${params.id}`)
    const prod = await response.json()
    setProduct(prod)
    cart.isItemAddedToCart(prod)
    useIsLoading(false)
  }
  console.log('here')
  
  useEffect(() => {
    console.log('here1')
    getProduct()
  }, []);
  
  return (
    <MainLayout>
      <div className="max-w-[1200px] mx-auto">
        <div className="flex px-4 py-10">
          
          {product?.url
            ? <img src={product?.url + '/280'} className="w-[40%] rounded-lg" alt="product"/>
            : <div className="w-[40%]"/>
          }
          <div className="px-4 w-full">
            <div className="font-bold text-xl">{product?.title}</div>
            <div className="text-sm text-gray-700 pt-2 ">Brand New - Full Warranty</div>
            
            <div className="border-b py-1"/>
            
            <div className="pt-3 pb-2">
              <div className="flex items-center">
                Condition: <span className="font-bold text-[17px] ml-2">New</span>
              </div>
            </div>
            <div className="border-b py-1"/>
            <div className="pt-3">
              <div className="w-full flex items-center justify-between">
                <div className="flex items-center">
                  Price:
                  {product?.price && <div className="font-bold text-[20px] ml-2">
                    USA $ {(product?.price / 100).toFixed(2)}</div>
                  }
                </div>
                <button
                  onClick={(event) => {
                    console.log('click')
                    if (cart.isItemAdded) {
                      cart.removeFromCart(product)
                      toast.info('Remove from cart', { autoClose: 3000 })
                    } else {
                      toast.info('Added to cart', { autoClose: 3000 })
                      cart.addToCart(product)
                    }
                  }}
                  className={`text - white py-2 px-20 rounded-full cursor-pointer bg-[#3498c9]
                 ${cart.isItemAdded ? 'bg-[#e9a321] hover:bg-[#bf851a]' : 'bg-[#3398c9] hover:bg-[#0054a0]'}`}
                >
                  {cart.isItemAdded ? 'Remove From Cart' : 'Add To Cart'}
                </button>
              </div>
            </div>
            <div className="border-b py-1"/>
            <div className="pt-3">
              <div className="font-semibold pb-1">Description:</div>
              <div className="text-sm">{product?.description}</div>
            </div>
          </div>
        </div>
      </div>
      <SimilarProducts/>
    </MainLayout>
  )
}

export default Product;