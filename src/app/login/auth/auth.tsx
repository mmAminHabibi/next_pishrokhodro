"use client";
import React, { useState } from "react";
import style from "./auth.module.scss";
import {getToken} from "@/core/http";
import Image from "next/image";

interface AuthProps {
    onSubmitSuccess?: (phone: string) => void;
}

export default function Auth({ onSubmitSuccess }: AuthProps) {
    const [phone, setPhone] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!phone || phone.length < 10) {
            setError("لطفاً شماره تماس معتبر وارد کنید.");
            return;
        }

        setError("");
        setLoading(true);

        try {
            const data = await getToken("phone", phone, null);
            
            // Check if response has error or invalid status
            if (data.error || data.status === false) {
                setError(data.message || "خطا در ارسال کد");
                return;
            }
            
            // Success - move to next step
            if (onSubmitSuccess) onSubmitSuccess(phone);

        } catch (err: any) {
            console.error("خطا در ارسال شماره:", err);
            
            // Detect error type and show appropriate message
            let errorMessage = "خطا در ارسال شماره تماس. لطفاً دوباره تلاش کنید.";
            
            if (err.message) {
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
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container my-5">
            <div className={style["auth"]}>
                <div
                    className={
                        style["auth-box"] +
                        " bg-color px-5 py-4 border-radius-14px m-auto"
                    }
                >
                    <div className={style["auth-box-logo"]}>
                        <Image className={'d-lg-block d-none'} src={'/images/full-logo.png'} alt={'Logo'} width={350} height={100} />
                        <Image className={'d-lg-none d-block'} src={'/images/full-logo.png'} alt={'Logo'} width={230} height={100} />
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className={style["auth-box-input"] + " mt-5 text-center"}>
                            <h4>برای ادامه کار لطفا شماره تماس خود را وارد کنید.</h4>
                            <input
                                className="bg-white border-0 border-radius-14px px-4 py-3 w-100 mt-3 text-center fs-24px"
                                type="number"
                                placeholder="شماره تماس خود را وارد کنید"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>

                        {error && <p className="text-danger mt-2">{error}</p>}

                        <div className={style["auth-box-submit"] + " mt-3 text-center"}>
                            <button
                                type="submit"
                                className="btn bg-btn py-2 px-5 border-radius-14px text-white w-100"
                                disabled={loading}
                            >
                                <h3 className="p-0 m-0">
                                    {loading ? "در حال ارسال..." : "ارسال"}
                                </h3>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
