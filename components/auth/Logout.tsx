"use client";

import { useRouter } from "next/navigation";
import AuthService from "@/services/AuthService";

const Logout = () => {
    const router = useRouter();

    const handleSignOut = async () => {
        try {
            await AuthService.signOut();
            router.refresh();
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error(error.message);
            } else {
                console.error("An unexpected error occurred.");
            }
        }
    };

    return (
        <>
            <button onClick={handleSignOut}>Sign out</button>
        </>
    );
};

export default Logout;
