import { supabase } from "@/lib/supabaseClient";
import { setCookie } from "cookies-next";

export class AuthService {
    async signInWithEmail(email: string): Promise<void> {
        try {
            const { error } = await supabase.auth.signInWithOtp({ email });
            if (error) {
                throw new Error(`Error signing in with email: ${error.message}`);
            }
        } catch (error) {
            console.error('signInWithEmail error:', error);
            throw new Error('Failed to send OTP. Please try again.');
        }
    }

    async verifyOtp(email: string, otp: string): Promise<void> {
        try {
            const { data: { session }, error } = await supabase.auth.verifyOtp({
                email,
                token: otp,
                type: 'email'
            });
            if (error) {
                throw new Error(`Error verifying OTP: ${error.message}`);
            }
            if (!session) {
                throw new Error('No session returned after OTP verification.');
            }
            setCookie('supabase', session, { path: '/' });
        } catch (error) {
            console.error('verifyOtp error:', error);
            throw new Error('Failed to verify OTP. Please try again.');
        }
    }

    async signOut(): Promise<void> {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) {
                throw new Error(`Error signing out: ${error.message}`);
            }
            setCookie('supabase', '', { path: '/', maxAge: -1 }); // Remove the cookie
        } catch (error) {
            console.error('signOut error:', error);
            throw new Error('Failed to sign out. Please try again.');
        }
    }
}

export default new AuthService();
