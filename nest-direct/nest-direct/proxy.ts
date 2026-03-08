import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  // Check if accessing protected routes  
  if (request.nextUrl.pathname.startsWith("/list-property")) {
    console.log("🔒 /list-property accessed - allowing through (client-side protection only)");
    
    // TEMPORARILY DISABLED: Server-side auth check due to cookie issue
    // The client-side protection in the page component will handle this
    // TODO: Fix Supabase SSR cookie sharing later
    
    /*
    // Debug cookies
    const cookies = request.cookies.getAll();
    console.log("🍪 Available cookies:", cookies.filter(c => c.name.includes('supabase')));

    // First try to get session
    const {
      data: { session },
      error: sessionError
    } = await supabase.auth.getSession();
    
    console.log("📱 Session result:", { 
      hasSession: !!session, 
      sessionError: sessionError?.message,
      accessToken: session?.access_token ? 'present' : 'missing'
    });

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    console.log("👤 User result:", {
      hasUser: !!user,
      email: user?.email,
      userError: userError?.message,
    });

    // If no user is found, redirect to home page
    if (!user) {
      console.log("❌ No user found - redirecting to home");
      return NextResponse.redirect(new URL("/", request.url));
    }

    console.log("✅ User authenticated - allowing access");
    */
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static files
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
