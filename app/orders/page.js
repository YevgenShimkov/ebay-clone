'use client'

import MainLayout from "@/app/layouts/MainLayout";
import { CiDeliveryTruck } from "react-icons/ci";
import Link from "next/link";
import { useUser } from "@/app/context/user";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import useIsLoading from "@/app/hooks/useIsLoading";
import moment from "moment";

const Orders = () => {
  
  const { user } = useUser();
  const [orders, setOrders] = useState([])
  
  const getOrders = async () => {
    try {
      if (!user && !user?.id) return
      const response = await fetch('/api/orders')
      const result = await response.json()
      setOrders(result)
      useIsLoading(false)
    } catch (error) {
      toast.error('Something went wrong!', { autoClose: 3000 })
      useIsLoading(false)
    }
  }
  
  useEffect(() => {
    useIsLoading(true)
    getOrders()
  }, [user]);
  
  return (
    <MainLayout>
      <div id="OrdersPage" className="mt-4 max-w[1200px] mx-auto px2 min-h-[50vh]">
        <div className="bg-white w-full p-6 min-h-[150px]">
          <div className="flex items-center text-xl">
            <CiDeliveryTruck className="text-green-500" size={35}/>
            <span className="pl-4">Orders</span>
          </div>
          {
            orders.length < 1 && <div className="flex items-center justify-center">
              You have no order history
            </div>
          }
          {
            orders.map(order => (
              <div className="text-sm pl-[50px]" key={order.id}>
                <div className="border-b py-1">
                  <div className="ppt-2">
                    <span className="font-bold mr-2">Stripe ID:</span>
                    {order?.stripe_id}
                  </div>
                  <div className="ppt-2">
                    <span className="font-bold mr-2">Delivery Address:</span>
                    {order?.name},{order?.address},{order?.zipcode},{order?.city},{order?.country},
                  </div>
                  <div className="ppt-2">
                    <span className="font-bold mr-2">Total:</span>
                    ${(order?.total / 100).toFixed(2)}
                  </div>
                  <div className="ppt-2">
                    <span className="font-bold mr-2">Order Created:</span>
                    {moment(order?.created_at).calendar()}
                  </div>
                  <div className="ppt-2">
                    <span className="font-bold mr-2">Delivery Time:</span>
                    {moment(order?.created_at).add(3, 'days').calendar()}
                  </div>
                  <div className="flex items-center gap-4">
                    {order?.orderItem.map(item => (
                      <div key={item.id} className="flex items-center">
                        <Link
                          href={`/product/${item.product_id}`}
                          className="py-1 hover:underline text-blue-500 font-bold"
                        >
                          <img className="rounded" width="120" src={item.product.url + '/120'}/>
                          {item?.product.title}
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </MainLayout>
  )
}

export default Orders;

