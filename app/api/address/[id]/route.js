import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import prisma from "@/app/libs/Prisma";
import { NextResponse } from "next/server";

const getUser = async () => {
  const supabase = createServerComponentClient({ cookies })
  const { data: { user } } = await supabase.auth.getUser()
  
  return user;
}

const getAddress = async (userId) => {
  const res = await prisma.address.findFirst({
    where: {user_id: userId}
  })
  
  return res;
}

export async function GET() {
  try {
    const user = await getUser();
    if (!user) throw Error('User is no authenticated');
    const address = await getAddress(user?.id)
    await prisma.$disconnect();
    
    return NextResponse.json(address)
  } catch (error) {
    console.log(error)
    await prisma.$disconnect();
    
    return new NextResponse('Something went wrong', { status: 400 });
  }
}