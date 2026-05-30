"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import "../[content]/content.scss";
import "./registration.scss"
import { FormContact } from "@/app/shared/shared-form";
import {VeteranRegistration} from "@/app/veteran-registration/VeteranRegistration";

export default function VeteranRegistrationPage() {
    const router = useRouter();
    const [registrationData, setRegistrationData] = useState<VeteranRegistration | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const hasChecked = useRef(false);
    const isRedirecting = useRef(false);

    useEffect(() => {
        // Prevent multiple checks
        if (hasChecked.current) return;
        
        // Check authentication
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");
        
        if (!token || !userData) {
            // Not authenticated, redirect to login (only once)
            if (!isRedirecting.current) {
                isRedirecting.current = true;
                router.push('/login?fallback=/veteran-registration');
            }
            return;
        }
        
        hasChecked.current = true;
        setIsAuthenticated(true);
        
        // Fetch registration data
        const fetchData = async () => {
            try {
                const { getApiService } = await import("@/core/http");
                const data: VeteranRegistration = await getApiService("veteran_registration");
                setRegistrationData(data);
            } catch (error) {
                console.error("Error fetching registration data:", error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchData();
    }, []);

    if (!isAuthenticated) {
        return (
            <div className="container py-5">
                <div className="text-center h-full d-flex align-items-center justify-content-center">
                    <h1 className='fa-3x'>در حال انتقال به صفحه ورود...</h1>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="container py-5">
                <div className="text-center h-full d-flex align-items-center justify-content-center">
                    <h1 className='fa-3x'>در حال بارگذاری...</h1>
                </div>
            </div>
        );
    }

    if (!registrationData) {
        return (
            <div className="container py-5">
                <div className="text-center h-full d-flex align-items-center justify-content-center">
                    <h1 className='fa-3x'>خطا در بارگذاری اطلاعات</h1>
                </div>
            </div>
        );
    }

    const registration = registrationData.data.veteran_registration.form_type;
    let description = registration.description;

    description = description.replace(
        /(مدارک مورد نیاز[\s\S]*?)(?=\s|$)/g,
        '<span class="highlight">$1</span><br>'
    );

    const descriptionWithBr = description.replace(/([.!:؛])\s*(?=[^<]|$)/g, '$1<br>');

    return (
        <>
            <div className="container py-5">
                <div className="registration">
                    <div className="registration-title">
                        <h2 className="fa-3x">{ registration.title }</h2>
                    </div>

                    <div className="registration-info p-3 my-4">
                        <h4
                            className="text-white"
                            dangerouslySetInnerHTML={{ __html: descriptionWithBr }}
                        ></h4>
                    </div>

                    <div className="registration-form">
                        <div className="container">
                            <FormContact isRegistration={true} variant={'registration'} formId={registration.id} data={registration.fields}/>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
