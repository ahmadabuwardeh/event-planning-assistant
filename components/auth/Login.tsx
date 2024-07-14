"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import AuthService from "../../services/AuthService";

const Login = () => {
    const [email, setEmail] = useState<string>("");
    const [otp, setOtp] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const [otpSent, setOtpSent] = useState<boolean>(false);
    const router = useRouter();

    const handleSignIn = async (e: FormEvent) => {
        e.preventDefault();
        setMessage("");

        try {
            await AuthService.signInWithEmail(email);
            setOtpSent(true);
            setMessage("Check your email for the OTP!");
        } catch (error) {
            handleError(error);
        }
    };

    const handleVerifyOtp = async (e: FormEvent) => {
        e.preventDefault();
        setMessage("");

        try {
            await AuthService.verifyOtp(email, otp);
            setMessage("OTP verified! Redirecting...");
            setTimeout(() => {
                router.push("/");
            }, 1000);
        } catch (error) {
            handleError(error);
        }
    };

    const handleError = (error: unknown) => {
        if (error instanceof Error) {
            setMessage(error.message);
        } else {
            setMessage("An unexpected error occurred.");
        }
    };

    return (
        <div>
            {message && <p className="text-emerald-500 mb-4">{message}</p>}
            {!otpSent ? (
                <form onSubmit={handleSignIn} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-gray-200 font-medium mb-2">Email</label>
                        <input
                            id="email"
                            className="bg-gray-800 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            type="email"
                            value={email}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-emerald-500 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Send OTP
                    </button>
                </form>
            ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                    <div>
                        <label htmlFor="otp" className="block text-gray-200 font-medium mb-2">OTP</label>
                        <input
                            id="otp"
                            className="bg-gray-800 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            type="text"
                            value={otp}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setOtp(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-emerald-500 hover:bg-emerald-700 text-gray-50 font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Verify OTP
                    </button>
                </form>
            )}
        </div>
    );
};

export default Login;