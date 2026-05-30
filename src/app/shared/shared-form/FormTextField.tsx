'use client';

import React from 'react';
import { BaseFieldProps } from './types';

interface FormTextFieldProps extends BaseFieldProps {
    isLoggedIn?: boolean;
}

const FormTextField: React.FC<FormTextFieldProps> = ({
    field,
    value,
    error,
    touched,
    disabled,
    onChange,
    onBlur,
    variant = "page",
    flag = false,
    isLoggedIn = false,
}) => {
    const getInputType = () => {
        if (field.machine_name === "email") return "email";
        if (field.machine_name === "phone_number" || field.machine_name === "mobile" || field.machine_name === "phone") return "tel";
        if (field.machine_name === "password") return "password";
        return "text";
    };

    const inputClass = () => {
        const base =
            variant === "footer"
                ? "form-control rounded-pill text-start mb-2"
                : "input-form border border-radius-14px p-3 w-100 text-start mb-1 transition-colors";
        if (error && touched) return `${base} border border-danger`;
        if (flag) return `${base} border border-success`;
        return base;
    };

    const stringValue = typeof value === "string" ? value : "";

    return (
        <div className={`col-12 col-md-${field.field_size || 12} mb-3`}>
            <input
                type={getInputType()}
                placeholder={field.title}
                disabled={
                    disabled ||
                    (isLoggedIn && field.machine_name === "tel" && stringValue !== "")
                }
                value={stringValue}
                onChange={(e) => onChange(e.target.value)}
                onBlur={onBlur}
                className={inputClass()}
            />
            {field.machine_name === 'phone' && (
                <p className={'mt-2 mb-0 mx-3'}>نمونه :  38888888-025</p>
            )}
            {error && touched && (
                <div className="text-danger mt-1 small">{error}</div>
            )}
        </div>
    );
};

export default FormTextField;
