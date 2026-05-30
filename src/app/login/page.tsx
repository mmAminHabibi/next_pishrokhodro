"use client"
import { useState, useEffect } from "react";
import Auth from "@/app/login/auth/auth";
import Confirm from "@/app/login/confirm/confirm";

export default function Login() {
    const [step, setStep] = useState<"auth" | "confirm">("auth");
    const [phone, setPhone] = useState<string>("");
    const [fallback, setFallback] = useState<string>("/");

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const fallbackUrl = params.get("fallback") || "/";
        setFallback(fallbackUrl);
    }, []);

    const handleAuthSubmit = (userPhone: string) => {
        setPhone(userPhone);
        setStep("confirm");
    };

    return (
        <>
            {step === "auth" && <Auth onSubmitSuccess={handleAuthSubmit} />}
            {step === "confirm" && <Confirm phone={phone as string} fallback={fallback} />}
        </>
    );
}
