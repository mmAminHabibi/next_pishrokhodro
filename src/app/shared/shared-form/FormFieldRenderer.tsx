'use client';

import React from 'react';
import { Field } from './types';
import FormTextField from './FormTextField';
import FormTextareaField from './FormTextareaField';
import FormFileField from './FormFileField';
import FormSelectField from './FormSelectField';
import FormDateField from './FormDateField';

interface FormFieldRendererProps {
    field: Field;
    value: string | File;
    error?: string;
    touched: boolean;
    disabled: boolean;
    onChange: (value: string | File) => void;
    onBlur: () => void;
    variant?: "footer" | "page" | "registration";
    flag?: boolean;
    isLoggedIn?: boolean;
    selectedProvinceId: number | null;
    selectedTownId: number | null;
    towns: { id: number; title: string }[];
    onProvinceChange: (provinceId: number | null, provinceTitle: string) => void;
    onTownChange: (townId: number | null, townTitle: string) => void;
    townValue?: string;
}

const FormFieldRenderer: React.FC<FormFieldRendererProps> = ({
    field,
    value,
    error,
    touched,
    disabled,
    onChange,
    onBlur,
    variant,
    flag,
    isLoggedIn,
    selectedProvinceId,
    selectedTownId,
    towns,
    onProvinceChange,
    onTownChange,
    townValue,
}) => {
    // Textarea (form_field_type_id === 2)
    if (field.form_field_type_id === 2) {
        return (
            <FormTextareaField
                field={field}
                value={value}
                error={error}
                touched={touched}
                disabled={disabled}
                onChange={onChange}
                onBlur={onBlur}
                variant={variant}
                flag={flag}
            />
        );
    }

    // Select (form_field_type_id === 12) - Province and Town
    if (field.form_field_type_id === 12) {
        const items = field.items ?? [];
        return (
            <React.Fragment>
                <FormSelectField
                    field={field}
                    value={value}
                    error={error}
                    touched={touched}
                    disabled={disabled}
                    onChange={onChange}
                    variant={variant}
                    flag={flag}
                    items={items}
                    selectedProvinceId={selectedProvinceId}
                    selectedTownId={selectedTownId}
                    towns={towns}
                    onProvinceChange={onProvinceChange}
                    onTownChange={onTownChange}
                    isProvince={true}
                />
                <FormSelectField
                    field={{
                        ...field,
                        machine_name: "town",
                        title: "شهر"
                    }}
                    value={townValue || ""}
                    touched={touched}
                    disabled={disabled}
                    onChange={(val) => {
                        // town value handled by onTownChange callback
                        if (typeof val === "string") {
                            const selectedTown = towns.find(t => t.title === val);
                            if (selectedTown) {
                                onTownChange(selectedTown.id, val);
                            } else {
                                onTownChange(null, val);
                            }
                        }
                    }}
                    variant={variant}
                    flag={flag}
                    items={[]}
                    selectedProvinceId={selectedProvinceId}
                    selectedTownId={selectedTownId}
                    towns={towns}
                    onProvinceChange={onProvinceChange}
                    onTownChange={onTownChange}
                    isProvince={false}
                />
            </React.Fragment>
        );
    }

    // File (form_field_type_id === 8)
    if (field.form_field_type_id === 8) {
        return (
            <FormFileField
                field={field}
                value={value}
                error={error}
                touched={touched}
                disabled={disabled}
                onChange={onChange}
                onBlur={onBlur}
                variant={variant}
                flag={flag}
            />
        );
    }

    // Date (birthday or certificate_date)
    if (field.machine_name === "birthday" || field.machine_name === 'certificate_date') {
        return (
            <FormDateField
                field={field}
                value={value}
                error={error}
                touched={touched}
                disabled={disabled}
                onChange={onChange}
                onBlur={onBlur}
                variant={variant}
                flag={flag}
            />
        );
    }

    // Default text input
    return (
        <FormTextField
            field={field}
            value={value}
            error={error}
            touched={touched}
            disabled={disabled}
            onChange={onChange}
            onBlur={onBlur}
            variant={variant}
            flag={flag}
            isLoggedIn={isLoggedIn}
        />
    );
};

export default FormFieldRenderer;
