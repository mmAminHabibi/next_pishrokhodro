// app/contact/button.tsx
"use client";

import React, { useState } from "react";
import { FormContact, Field } from "@/app/shared/shared-form";

interface ButtonProps {
    data: {
        id: string;
        fields: Field[];
    };
}

export default function Button({ data }: ButtonProps) {
    const [activeSection, setActiveSection] = useState<"map" | "form">("form");

    const toggleSection = () => {
        setActiveSection(prev => (prev === "form" ? "map" : "form"));
    };

    return (
        <div className="container">
            <div className="mb-3 d-flex gap-3">
                <button
                    className="btn bg-btn text-white"
                    onClick={toggleSection}
                >
                    {activeSection === "form"
                        ? "ارتباط از طریق نقشه"
                        : "ارتباط از طریق فرم"}
                </button>
            </div>

            {activeSection === "form" && (
                <div className="transition-all duration-300 d-block">
                    <FormContact isRegistration={false} formId={data.id} data={data.fields} />
                </div>
            )}

            {activeSection === "map" && (
                <div className="transition-all duration-300 d-block">
                    <iframe
                        className="border-radius-14px w-100"
                        src="https://www.google.com/maps?q=تهران, انتهای همت غرب, بزرگراه خرازی, مجتمع رزمال&output=embed"
                        height="500px"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>
            )}
        </div>
    );
}
