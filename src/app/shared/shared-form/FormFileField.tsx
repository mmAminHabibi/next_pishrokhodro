'use client';

import React from 'react';
import { BaseFieldProps } from './types';

const FormFileField: React.FC<BaseFieldProps> = ({
    field,
    error,
    touched,
    disabled,
    onChange,
    onBlur,
    variant = "page",
    flag = false,
}) => {
    const inputClass = () => {
        const base =
            variant === "footer"
                ? "form-control rounded-pill text-start mb-2"
                : "input-form border border-radius-14px p-3 w-100 text-start mb-1 transition-colors";
        if (error && touched) return `${base} border border-danger`;
        if (flag) return `${base} border border-success`;
        return base;
    };

    return (
        <div className={`col-12 col-md-${field.field_size || 12} mb-3`}>
            <label className="mb-2">{field.title}</label>
            <input
                type="file"
                disabled={disabled}
                onChange={(e) => {
                    const files = e.target.files;
                    if (files && files[0]) {
                        onChange(files[0]);
                    } else {
                        onChange("");
                    }
                }}
                onBlur={onBlur}
                className={inputClass()}
                accept=".jpg,.jpeg,.pdf"
            />
            {error && touched && (
                <div className="text-danger mt-1 small">{error}</div>
            )}
        </div>
    );
};

export default FormFileField;
