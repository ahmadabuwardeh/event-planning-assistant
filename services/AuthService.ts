import { supabase } from "@/lib/supabaseClient";

export class AuthService {
    async signInWithEmail(email: string) {
        const { error } = await supabase.auth.signInWithOtp({ email });
        if (error) {
            throw error;
        }
    }

    async signOut() {
        const { error } = await supabase.auth.signOut();
        if (error) {
            throw error;
        }
    }

    async getSession() {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
            throw error;
        }
        return data.session;
    }
}