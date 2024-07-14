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
        <div className="login-container">
            {message && <p className="message">{message}</p>}
            {!otpSent ? (
                <form onSubmit={handleSignIn} className="login-form">
                    <label>Email</label>
                    <input
                        className="input-field bg-amber-400"
                        type="email"
                        value={email}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                        required
                    />
                    <button type="submit" className="submit-button">Send OTP</button>
                </form>
            ) : (
                <form onSubmit={handleVerifyOtp} className="otp-form">
                    <label>OTP</label>
                    <input
                        className="input-field bg-amber-400"
                        type="text"
                        value={otp}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setOtp(e.target.value)}
                        required
                    />
                    <button type="submit" className="submit-button">Verify OTP</button>
                </form>
            )}
        </div>
    );
};

export default Login;
