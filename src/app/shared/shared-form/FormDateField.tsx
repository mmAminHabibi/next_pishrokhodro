'use client';

import React from 'react';
import DatePicker from "react-multi-date-picker";
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { BaseFieldProps } from './types';

const FormDateField: React.FC<BaseFieldProps> = ({
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
    const inputClass = () => {
        const base =
            variant === "footer"
                ? "form-control rounded-pill text-start mb-2"
                : "input-form border border-radius-14px p-3 w-100 text-start mb-1 transition-colors";
        if (error && touched) return `${base} border border-danger`;
        if (flag) return `${base} border border-success`;
        return base;
    };

    const dateValue = typeof value === "string" ? value : "";
    let dateObject: DateObject | undefined = undefined;

    if (dateValue && dateValue.trim() !== "") {
        try {
            dateObject = new DateObject({
                date: dateValue,
                format: "YYYY/MM/DD",
                calendar: persian,
                locale: persian_fa
            });
        } catch {
            dateObject = undefined;
        }
    }

    return (
        <div className={`col-12 col-md-${field.field_size || 12} mb-3`}>
            <DatePicker
                value={dateObject}
                onChange={(date) => {
                    const formatted = date ? date.format("YYYY/MM/DD") : "";
                    onChange(formatted);
                }}
                onClose={onBlur}
                calendar={persian}
                locale={persian_fa}
                inputClass={inputClass()}
                placeholder={field.title}
                disabled={disabled}
                style={{ width: "100%" }}
            />
            {error && touched && (
                <div className="text-danger mt-1 small">{error}</div>
            )}
        </div>
    );
};

export default FormDateField;
