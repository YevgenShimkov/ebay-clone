'use client'

import MainLayout from "@/app/layouts/MainLayout";
import { AiOutlineCheckCircle } from "react-icons/ai";
import Link from "next/link";

const SuccessPage = () => {
  return (
    <MainLayout>
      <div className="mt-21 max-w-[1200px] mx-auto px-2 min-h-[50vh]">
        <div className="bg-white w-full p-6 min-h-[150px] flex items-center justify-center">
          <div>
            <div className="flex items-center text-xl">
              <AiOutlineCheckCircle className="text-green-500" size={35}/>
              <span className="pl-4">Payment Successful</span>
            </div>
            <p>Thank you! We`ve received your payment.</p>
            <Link href="/" className="w-full">
              <div className="w-full text-center bg-blue-600 text-sm font-semibold text-white p-[11px] mt-4">
                Back to shop
              </div>
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export default SuccessPage;

