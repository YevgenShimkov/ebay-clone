import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import prisma from "@/app/libs/Prisma";
import { NextResponse } from "next/server";


export async function POST(req) {
  const supabase = createServerComponentClient({ cookies })
  
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) throw Error();
    
    const body = await req.json();
    
    const res  = await prisma.address.update(
      {
        where: { id: Number(body.addressId) },
        data: {
          name: body.name,
          address: body.address,
          zipcode: body.zipcode,
          city: body.city,
          country: body.country,
        }
      }
    )
    
    await prisma.$disconnect();
    return NextResponse.json(res)
    
  } catch (error) {
    console.log(error)
    await prisma.$disconnect();
    return new NextResponse('Something went wrong', { status: 400 });
  }
}