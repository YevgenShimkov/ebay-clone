import prisma from "@/app/libs/Prisma";
import { NextResponse } from "next/server";

//todo simplify this like address/id/route
export async function GET(req, context) {
  
  try {
    const productsCount = await prisma.products.count();
    const skip = Math.floor(Math.random() * productsCount);
    
    const products = await prisma.products.findMany({
      take: 5,
      skip: skip,
      orderBy: { id: 'asc' },
    })
    
    await prisma.$disconnect();
    return NextResponse.json(products);
    
  } catch (error) {
    console.log(error)
    await prisma.$disconnect();
    return new NextResponse('Something went wrong', { status: 400 });
  }
}