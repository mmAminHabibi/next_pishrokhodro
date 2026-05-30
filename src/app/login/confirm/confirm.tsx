"use client";
import style from "./confirm.module.scss";
import React, { useRef, useState } from "react";
import { getToken } from "@/core/http";
import Image from "next/image";

interface ConfirmProps {
    phone: string ;
    fallback : string ;
}

export default function Confirm({ phone , fallback  }: ConfirmProps) {
    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 1);
        e.target.value = value;

        if (value && index < inputsRef.current.length - 1) {
            inputsRef.current[index + 1]?.focus();
        } else if (!value && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");

        const code = inputsRef.current.map((input) => input?.value || "").join("");

        if (code.length < 4) {
            setError("کد تأیید باید ۴ رقم باشد.");
            return;
        }

        setLoading(true);
        try {
            const data = await getToken("code", phone, code);
            
            // Check if code is invalid
            if (data.error || data.status === false) {
                const errorMessage = data.message || "کد معتبر نمی‌باشد.";
                setError(errorMessage);
                
                // Clear the input fields on error
                inputsRef.current.forEach((input) => {
                    if (input) input.value = "";
                });
                inputsRef.current[0]?.focus();
                return;
            }
            
            // Check if access_token exists
            if (!data.access_token) {
                setError("خطا در دریافت توکن. لطفاً دوباره تلاش کنید.");
                return;
            }
            
            setSuccessMessage("کد تأیید شد در حال انتقال به صفحه...");
            
            const userData = {
                ...data,
                mobile: phone
            };
            
            if (userData.user) {
                let userObject = userData.user;
                if (typeof userObject === 'string') {
                    userObject = JSON.parse(userObject);
                }
                userObject.phone = phone;
                userData.user = userObject;
            }
            
            localStorage.setItem("token", data.access_token);
            localStorage.setItem("user", JSON.stringify(userData));
            
            setTimeout(() => {
                window.location.href = fallback;
            }, 2000);
        } catch (err: unknown) {
            console.error("خطا در تأیید کد:", err);
            
            // Detect error type and show appropriate message
            let errorMessage = "خطا در تأیید کد. لطفاً دوباره تلاش کنید.";
            
            if (err instanceof Error && err.message) {
                if (err.message.includes("Failed to fetch") || err.message.includes("fetch")) {
                    errorMessage = "خطا در اتصال به سرور. لطفاً اتصال اینترنت خود را بررسی کنید و دوباره تلاش کنید.";
                } else if (err.message.includes("خطای سرور")) {
                    errorMessage = "خطا در سمت سرور. لطفاً چند لحظه صبر کنید و دوباره تلاش کنید.";
                } else if (err.message.includes("timeout")) {
                    errorMessage = "زمان اتصال به پایان رسید. لطفاً دوباره تلاش کنید.";
                } else {
                    errorMessage = err.message;
                }
            }
            
            setError(errorMessage);
            
            // Clear the input fields on error
            inputsRef.current.forEach((input) => {
                if (input) input.value = "";
            });
            inputsRef.current[0]?.focus();
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container my-5">
            <div className={style["confirm-box"] + " bg-color px-5 py-4 border-radius-14px m-auto"}>
                <div className={style["confirm-box-logo"]}>
                    <Image className={'d-lg-block d-none'} src={'/images/full-logo.png'} alt={'Logo'} width={350} height={100} />
                    <Image className={'d-lg-none d-block'} src={'/images/full-logo.png'} alt={'Logo'} width={230} height={100} />
                </div>

                <form dir="rtl" onSubmit={handleSubmit}>
                    <div className={style["confirm-box-input"] + " mt-5 text-center"}>
                        <h3>
                            کدی برای شماره همراه <span className="second-color">{phone}</span> ارسال شد
                        </h3>

                        <div className="d-flex align-items-center justify-content-center gap-3 mt-3" dir={'ltr'}>
                            {[...Array(5)].map((_, i) => (
                                <input
                                    key={i}
                                    ref={(el) => {
                                        if (el) {
                                            inputsRef.current[i] = el;
                                        }
                                    }}
                                    className="border-radius-14px text-center"
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    maxLength={1}
                                    onChange={(e) => handleChange(i, e)}
                                />
                            ))}
                        </div>
                    </div>

                    {error && <p className="text-danger mt-3">{error}</p>}
                    {successMessage && <p className="text-success mt-3">{successMessage}</p>}

                    <div className={style["confirm-box-submit"] + " mt-4 text-center"}>
                        <button
                            type="submit"
                            className="btn bg-btn py-2 px-5 border-radius-14px text-white w-100"
                            disabled={loading}
                        >
                            <h3 className="p-0 m-0">{loading ? "در حال ارسال..." : "ورود"}</h3>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
