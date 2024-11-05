import { clerkMiddleware,createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
const isPublicRoute=createRouteMatcher([
    "/sign-in",
    "/sign-up",
    "/",
    "/home"
])
const isPublicApiRoute =createRouteMatcher([
    "/api/videos",
])
export default  clerkMiddleware (async (auth,req)=>{
    
    const {userId}=  await auth();
    console.log(userId)
    const currentUrl=new URL(req.url)
    const isAccessingDashboard = currentUrl.pathname ==="/home" 
    const isApiRequest=currentUrl.pathname.startsWith("/api")

    if(userId && isPublicRoute(req) && !isAccessingDashboard) {
        return NextResponse.redirect(new URL('/home',req.url));
    }
    //not logged in
    if(!userId) {
        // trying to access protected routes
        if(!isPublicRoute(req) &&  !isPublicApiRoute(req)){
            return NextResponse.redirect(new URL('/sign-in',req.url));
        }
        // trying to access  API routes other than download or compress video 
        if(isApiRequest &&!isPublicApiRoute(req)){ 
            return NextResponse.redirect(new URL('/sign-in',req.url));
    }
}

  return NextResponse.next()

})

export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};