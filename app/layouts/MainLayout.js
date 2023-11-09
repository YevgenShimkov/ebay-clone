'use client'

import TopMenu from "@/app/layouts/includes/TopMenu";
import MainHeader from "@/app/layouts/includes/MainHeader";
import SubMenu from "@/app/layouts/includes/SubMenu";
import Footer from "@/app/layouts/includes/Footer";
import { useEffect, useState } from "react";
import Loading from "@/app/components/loading/Loading";

const MainLayout = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false)
  
  useEffect(() => {
    window.addEventListener('storage', function () {
        let res = localStorage.getItem('isLoading')
        res === "false" ? setIsLoading(false) : setIsLoading(true)
      }
    )
  });
  
  return (
    <div id='MainLayout' className='min-w-[1050px] max-w-[1300px] mx-auto'>
      <div>
        {isLoading ? <Loading/> : <div></div>}
        <TopMenu/>
        <MainHeader/>
        <SubMenu/>
        {children}
        <Footer/>
      </div>
    </div>
  )
}

export default MainLayout;

