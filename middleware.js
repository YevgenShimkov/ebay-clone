import { NextResponse } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";


export async function middleware(req) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  const { data } = await supabase.auth.getSession()
  
  // if we already login, we redirect from auth page
  if (data?.session && req.nextUrl.pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL('/', req.url))
  }
  
  // if user not login, then redirect to auth page
  if (
    !data?.session && (
      //todo simplify this
      req.nextUrl.pathname.startsWith('/checkout') ||
      req.nextUrl.pathname.startsWith('/success') ||
      req.nextUrl.pathname.startsWith('/orders') ||
      req.nextUrl.pathname.startsWith('/address')
    )
  ) {
    return NextResponse.redirect(new URL('/auth', req.url))
  }
  
  return res;
  
}