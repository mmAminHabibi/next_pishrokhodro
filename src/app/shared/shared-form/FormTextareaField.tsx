'use client';

import React from 'react';
import { BaseFieldProps } from './types';

const FormTextareaField: React.FC<BaseFieldProps> = ({
    field,
    value,
    error,
    touched,
    disabled,
    onChange,
    onBlur,
    variant = "page",
    flag = false,
}) => {
    const textareaClass = () => {
        const base =
            variant === "footer"
                ? "form-control rounded text-start mb-2"
                : "textarea-form border border-radius-14px p-3 w-100 text-start mb-1 transition-colors";
        if (error && touched) return `${base} border border-danger`;
        if (flag) return `${base} border border-success`;
        return base;
    };

    const stringValue = typeof value === "string" ? value : "";

    return (
        <div className={`col-12 col-md-${field.field_size || 12} mb-3`}>
            <textarea
                placeholder={field.title}
                disabled={disabled}
                value={stringValue}
                onChange={(e) => onChange(e.target.value)}
                onBlur={onBlur}
                className={textareaClass()}
                rows={4}
            />
            {error && touched && (
                <div className="text-danger mt-1 small">{error}</div>
            )}
        </div>
    );
};

export default FormTextareaField;
