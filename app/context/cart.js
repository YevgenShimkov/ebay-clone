"use client"

import { createContext, useContext, useState } from "react";
import { useRouter } from "next/navigation";

const Context = createContext();

// todo refactor code
const Provider = ({ children }) => {
  const router = useRouter()
  
  const [isItemAdded, setIsItemAdded] = useState(false)
  
  const getCart = () => {
    let cart = []
    if (typeof localStorage !== "undefined") {
      cart = JSON.parse(localStorage.getItem('cart')) || []
    }
    return cart;
  }
  
  const addToCart = (product) => {
    let cart = []
    if (typeof localStorage !== "undefined") {
      cart = JSON.parse(localStorage.getItem('cart')) || []
    }
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart))
    isItemAddedToCart(product)
    // router.refresh();
  }
  
  const removeFromCart = (product) => {
    let cart = []
    if (typeof localStorage !== "undefined") {
      cart = JSON.parse(localStorage.getItem('cart')) || []
    }
    cart = cart.filter(item => item.id !== product.id)
    localStorage.setItem('cart', JSON.stringify(cart)) || []
    isItemAddedToCart(product)
    // router.refresh();
  }
  
  const isItemAddedToCart = (product) => {
    let cart = []
    if (typeof localStorage !== "undefined") {
      cart = JSON.parse(localStorage.getItem('cart')) || []
    }
    const searchingItem = cart.filter(item => item.id === product.id) // todo check - mb can do it with array.some
    if (searchingItem.length > 0) {
      setIsItemAdded(true)
      return
    }
    setIsItemAdded(false)
  }
  
  const cartCount = () => {
    let cart = []
    if (typeof localStorage !== "undefined") {
      cart = JSON.parse(localStorage.getItem('cart')) || []
    }
    return cart.length
  }
  
  const cartTotal = () => {
    let total = 0
    let cart = []
    if (typeof localStorage !== "undefined") {
      cart = JSON.parse(localStorage.getItem('cart')) || []
    }
    for (let i = 0; i < cart.length; i++) { // todo rewrite with array.map
      const element = cart[i]
      total += element.price
    }
    
    return total;
  }
  
  const clearCart = () => {
    localStorage.removeItem('cart')
    router.refresh();
  }
  
  const exposed = {
    isItemAdded,
    getCart,
    addToCart,
    removeFromCart,
    isItemAddedToCart,
    cartTotal,
    cartCount,
    clearCart,
  }
  
  return <Context.Provider value={exposed}>{children}</Context.Provider>
}
export const useCart = () => useContext(Context)
export default Provider;

