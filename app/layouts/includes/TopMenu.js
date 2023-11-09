'use client'

import Link from "next/link";
import Image from "next/image";

import { BsChevronDown } from "react-icons/bs";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useEffect, useState } from "react";
import { useUser } from "@/app/context/user";
import { useCart } from "@/app/context/cart";

const TopMenu = () => {
  const [isMenu, setIsMenu] = useState(false)
  const user = useUser();
  const cart = useCart();
  
  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  const isLoggedIn = () => {
    if (user && user?.id) {
      return (
        <button
          onClick={() => !isMenu ? setIsMenu(true) : setIsMenu(false)}
          className="flex items-center gap-2 hover:underline cursor-pointer"
        >
          <div>Hi, {user.name}</div>
          <BsChevronDown/>
        </button>
      )
    }
    
    return <Link href='/auth' className='flex items-center gap-2 hover:underline cursor-pointer'>
      <div>Login</div>
      <BsChevronDown/>
    </Link>
  }
  
  return (
    <div id="TopMenu" className="border-b">
      <div className="flex items-center justify-between w-full mx-auto max-w-[1200px]">
        <ul
          id='TopMenuLeft'
          className='flex items-center text-[11px] text-[#333333] px-2 h-8'
        >
          <li className='relative px-3'>
            {isLoggedIn(user)}
            <div
              id='AuthDropdown'
              className={`${isMenu ? "" : "hidden"} absolute bg-white w-[200px] text-[#333333] z-40 top-[20px] left-0 border shadow-lg`}
            >
              <div className='flex items-center justify-start gap-1 p-3'>
                <img width={50} src={user?.picture} alt='avatar'/>
                <div className='font-bold text-[13px]'>{user?.name}</div>
              </div>
              <div className='border-b'/>
              <ul className='bg-white'>
                <li
                  className='text-[11px] py-2 px-4 w-full hover:underline text-blue-500 hove r:text-blue-600 cursor-pointer'
                >
                  <Link href='/orders'>
                    My Orders
                  </Link>
                </li>
                <li
                  onClick={() => {
                    user.signOut();
                    setIsMenu(false)
                  }}
                  className='text-[11px] py-2 px-4 w-full hover:underline text-blue-500 hover:text-blue-600 cursor-pointer'
                >
                  Sign out
                </li>
              </ul>
            </div>
          </li>
          <li className='px-3 hover:underline cursor-pointer'>
            Daily Deals
          </li>
          <li className='px-3 hover:underline cursor-pointer'>
            Help & Contact
          </li>
        </ul>
        <ul
          id="TopMenuRight"
          className='flex items-center text-[11px] text-[#333333] px-2 h-8'
        >
          <li className='flex items-center gap-2 px-3 hover:underline cursor-pointer'>
            <Image src='/images/uk.png' alt='flag' width={32} height={32}/>
            Ship to
          </li>
          <li className='px-3 hover:underline cursor-pointer relative'>
            <Link href='/cart'>
              <AiOutlineShoppingCart size={22}/>
              {(cart.cartCount() > 0 && isClient)
                && <div
                  className='absolute flex justify-center text-[10px] -top-0.5 right-2 bg-red-500 w-3.5 h-3.5 rounded-full text-white'
                >{cart.cartCount()}
                </div>}
            </Link>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default TopMenu;

