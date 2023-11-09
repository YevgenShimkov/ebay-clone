'use client'

import MainLayout from "@/app/layouts/MainLayout";
import CheckoutItem from "@/app/components/checkout/CheckoutItem";
import { useUser } from "@/app/context/user";
import { useCart } from "@/app/context/cart";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import useIsLoading from "@/app/hooks/useIsLoading";
import useUserAddress from "@/app/hooks/useUserAddress";
import { loadStripe } from "@stripe/stripe-js";
import Link from "next/link";
import ClientOnly from "@/app/components/ClientOnly";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const Checkout = () => {
  const user = useUser();
  const cart = useCart();
  const router = useRouter();
  
  let stripeRef = useRef(null)
  let elementsRef = useRef(null)
  let cardRef = useRef(null)
  let clientSecretRef = useRef(null)
  
  const [addressDetails, setAddressDetails] = useState({})
  const [isLoadingAddress, setIsLoadingAddress] = useState(false)
  
  useEffect(() => {
    if (cart?.cartTotal() <= 0) {
      toast.error('Your cart is empty!', { autoClose: 3000 })
      return router.push('/')
    }
    
    useIsLoading(true)
    
    const getAddress = async () => {
      if (user?.id == null) {
        useIsLoading(false)
        return
      }
      
      setIsLoadingAddress(true)
      const response = await useUserAddress()
      if (response) setAddressDetails(response)
      setIsLoadingAddress(false)
    }
    
    getAddress()
    setTimeout(() => stripeInit(), 300)
    
    
  }, [user]);
  
  const stripeInit = async () => {
    stripeRef.current = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PK_KEY || '')
    
    const response = await fetch('/api/stripe', {
      method: 'POST',
      body: JSON.stringify({ amount: cart.cartTotal() })
    })
    
    const result = await response.json()
    
    clientSecretRef.current = result.client_secret
    elementsRef.current = stripeRef.current.elements();
    
    var style = {
      base: { fontSize: "18px" },
      invalid: {
        fontFamily: 'Arial, sans-serif',
        color: '#EE4B2B',
        iconColor: "#EE4B2B",
      }
    }
    
    cardRef.current = elementsRef.current.create("card", { hidePostalCode: true, style: style })
    
    cardRef.current.mount("#card-element")
    cardRef.current.on("change", function (event) {
      document.querySelector("button").disabled = event.empty;
      document.querySelector('#card-error').textContent = event.error ? event.error.message : ''
    })
    
    useIsLoading(false)
  }
  
  const pay = async (event) => {
    event.preventDefault();
    
    if (Object.entries(addressDetails).length === 0) {
      showError("Please add shipping address!")
      return
    }
    
    let result = await stripeRef.current.confirmCardPayment(clientSecretRef.current, {
      payment_method: { card: cardRef.current }
    })
    
    if (result.error) {
      showError(result.error.message)
    } else {
      useIsLoading(true)
      
      try {
        let response = await fetch('/api/orders/create', {
          method: "POST",
          body: JSON.stringify({
            stripe_id: result.paymentIntent.id,
            name: addressDetails.name,
            address: addressDetails.address,
            zipcode: addressDetails.zipcode,
            city: addressDetails.city,
            country: addressDetails.country,
            products: cart.getCart(),
            total: cart.cartTotal(),
          })
        })
        
        if (response.status === 200) {
          toast.success('Order Complete!', { autoClose: 3000 }) //todo move all toast on component
          cart.clearCart()
          return router.push('/success')
        }
      } catch (error) {
        console.log(error)
        toast.error("Something went wrong", { autoClose: 3000 })
      }
      useIsLoading(false)
    }
  }
  
  //todo try remove this logic on state and JSX without ID
  const showError = (errorMsgText) => {
    let errorMsg = document.querySelector("#card-error")
    toast.error(errorMsgText, { autoClose: 3000 })
    errorMsg.textContent = errorMsgText
    setTimeout(() => {
      errorMsg.textContent = ""
    }, 3000)
  }
  
  return (
    <MainLayout>
      <div id="CheckoutPage" className="mt-4 max-w-[1100px] mx-auto">
        <div className="text-2xl font-bold mt-4 mb-4">Checkout</div>
        <div className="relative flex items-baseline gap-4 justify-between mx-auto w-full">
          <div className="w-[65%]">
            <div className="bg-white rounded-lg p-4 border">
              <div className="text-xl font-semibold mb-2">Shipping Address</div>
              {!isLoadingAddress &&
                <Link
                  href="/address"
                  className="text-blue-500 text-sm underline"
                >
                  {addressDetails.name ? 'Update Address' : 'Add Address'}
                </Link>
              }
              {(!isLoadingAddress && addressDetails.name) &&
                <ul className="text-sm mt-2">
                  <li>Name: {addressDetails.name}</li>
                  <li>Address: {addressDetails.address}</li>
                  <li>Zipcode: {addressDetails.zipcode}</li>
                  <li>City: {addressDetails.city}</li>
                  <li>Country: {addressDetails.country}</li>
                </ul>
              }
              {isLoadingAddress &&
                <div className="flex items-center mt-1 gap-2">
                  <AiOutlineLoading3Quarters className="animate-spin"/>
                  Getting Address...
                </div>
              }
            </div>
            <ClientOnly>
              <div id="Items" className="bg-white rounded-lg mt-4">
                {cart.getCart().map(product => (
                  <CheckoutItem product={product} key={product.id}/>
                ))}
              </div>
            </ClientOnly>
          </div>
          <div id="PlaceOrder" className="relative -top-[6px] w-[35%] border rounded-lg">
            <ClientOnly>
              
              <div className="p-4">
                <div className="flex items-baseline justify-between text-sm mb-1">
                  <div>Items ({cart.getCart().length})</div>
                  <div>${(cart.cartTotal() / 100).toFixed(2)}</div>
                </div>
                <div className="flex items-center justify-between text-sm mb-4">
                  <div>Shipping:</div>
                  <div>Free</div>
                </div>
                <div className="border-t"/>
                <div className="flex items-center justify-between my-4">
                  <div className="font-semibold">Order total</div>
                  <div className="text-2xl font-semibold">${(cart.cartTotal() / 100).toFixed(2)}</div>
                </div>
                <form onSubmit={pay}>
                  <div className="border border-gray-500 p-2 rounded-sm" id="card-element"></div>
                  <p id="card-error"
                     role="alert"
                     className="text-red-700 text-center font-semibold relative top-2"
                  ></p>
                  <button className="mt-4 bg-blue-600 text-lg w-full text-white font-semibold p-3 rounded-full"
                          type="submit"
                  >Confirm and pay
                  </button>
                </form>
              </div>
            </ClientOnly>
            <div className="flex items-center p-4 justify-center gap-2 border-t">
              <img src="/images/logo.svg" alt="logo" width={50}/>
              <div className="font-light mb-2 mt-2 uppercase">Money back guarantee</div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export default Checkout;

