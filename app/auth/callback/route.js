import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type');
  const next = searchParams.get('next') ?? '/';

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from server route
          }
        },
      },
    }
  );

  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && data?.user) {
      try {
        await supabase
          .from('profiles')
          .update({ is_email_verified: true })
          .eq('id', data.user.id);
      } catch (e) {}
      // Redirect to email confirmed page
      return NextResponse.redirect(`${origin}/?email_verified=true`);
    }
  }

  if (token_hash && type) {
    const { data, error } = await supabase.auth.verifyOtp({ token_hash, type });
    if (!error && data?.user) {
      try {
        await supabase
          .from('profiles')
          .update({ is_email_verified: true })
          .eq('id', data.user.id);
      } catch (e) {}
      // Redirect to email confirmed page
      return NextResponse.redirect(`${origin}/?email_verified=true`);
    }
  }

  return NextResponse.redirect(`${origin}/`);
}
