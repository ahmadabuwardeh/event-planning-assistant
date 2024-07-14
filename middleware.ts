import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";
import { getCookie } from "cookies-next";
import { AuthSession } from "@supabase/supabase-js";

const authPages = ['/'];
const publicPages = ['/login'];

const isPublicPage = (path: string) => publicPages.includes(path);
const isAuthPage = (path: string) => authPages.includes(path);

export async function middleware(req: NextRequest) {
    const sessionCookie = getCookie('supabase', { req });
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req, res });

    if (sessionCookie) {
        try {
            const session = JSON.parse(sessionCookie as string) as AuthSession;
            const { data: user, error } = await supabase.auth.getUser(session.access_token);

            if (error) {
                throw error;
            }

            if (user && isPublicPage(req.nextUrl.pathname)) {
                req.nextUrl.searchParams.delete('threadId');
                return NextResponse.redirect(new URL('/', req.url));
            }
        } catch (error) {
            console.error('Error retrieving user:', error);
            req.nextUrl.searchParams.delete('threadId');
            return NextResponse.redirect(new URL('/login', req.url));
        }
    } else {
        if (isAuthPage(req.nextUrl.pathname)) {
            req.nextUrl.searchParams.delete('threadId');
            return NextResponse.redirect(new URL('/login', req.url));
        }
    }

    return res;
}
