'use client';

import React from 'react';
import Select from 'react-select';
import { BaseFieldProps } from './types';

interface FormSelectFieldProps extends BaseFieldProps {
    items: { id: number; title: string }[];
    selectedProvinceId: number | null;
    selectedTownId: number | null;
    towns: { id: number; title: string }[];
    onProvinceChange: (provinceId: number | null, provinceTitle: string) => void;
    onTownChange: (townId: number | null, townTitle: string) => void;
    isProvince?: boolean;
}

const FormSelectField: React.FC<FormSelectFieldProps> = ({
    field,
    value,
    error,
    touched,
    disabled,
    onChange,
    variant = "page",
    flag = false,
    items,
    selectedProvinceId,
    selectedTownId,
    towns,
    onProvinceChange,
    onTownChange,
    isProvince = false,
}) => {
    const selectStyles = {
        control: (base: any, state: any) => ({
            ...base,
            borderRadius: 14,
            padding: "0.7rem",
            minHeight: "56px",
            fontSize: "1rem",
            borderColor:
                error && touched
                    ? "red"
                    : flag
                        ? "green"
                        : base.borderColor,
            boxShadow: "none",
            "&:hover": { borderColor: "#2A2E6B" },
        }),
    };

    if (isProvince) {
        const stringValue = typeof value === "string" ? value : "";
        
        return (
            <>
                <div className="col-12 col-md-6 mb-3">
                    <Select
                        isDisabled={disabled}
                        value={items.map(item => ({ value: item.id, label: item.title }))
                            .find(opt => opt.label === stringValue) || null
                        }
                        onChange={async (selectedOption) => {
                            if (!selectedOption) {
                                onProvinceChange(null, "");
                                onChange("");
                                return;
                            }

                            const selected = items.find(it => it.id === selectedOption.value);
                            const title = selected?.title || "";
                            onChange(title);
                            onProvinceChange(selectedOption.value, title);
                        }}
                        options={items.map(item => ({ value: item.id, label: item.title }))}
                        placeholder={`انتخاب ${field.title}`}
                        classNamePrefix="react-select"
                        styles={selectStyles}
                    />
                    {error && touched && (
                        <div className="text-danger mt-1 small">{error}</div>
                    )}
                </div>
            </>
        );
    } else {
        // Town selector
        const stringValue = typeof value === "string" ? value : "";
        const isDisabled = !selectedProvinceId || towns.length === 0 || disabled;

        return (
            <div className="col-12 col-md-6 mb-3">
                <Select
                    isDisabled={isDisabled}
                    value={towns
                        .map(t => ({ value: t.id, label: t.title }))
                        .find(opt => opt.label === stringValue) || null
                    }
                    options={towns.map(t => ({ value: t.id, label: t.title }))}
                    placeholder={!selectedProvinceId ? "ابتدا استان را انتخاب کنید" : "انتخاب شهر"}
                    onChange={(selectedOption) => {
                        if (selectedOption) {
                            const title = selectedOption.label || "";
                            onChange(title);
                            onTownChange(selectedOption.value, title);
                        } else {
                            onChange("");
                            onTownChange(null, "");
                        }
                    }}
                    classNamePrefix="react-select"
                    styles={{
                        control: (base: any) => ({
                            ...base,
                            borderRadius: 14,
                            padding: "0.7rem",
                            minHeight: "56px",
                            fontSize: "1rem",
                            boxShadow: "none",
                            "&:hover": { borderColor: "#2A2E6B" },
                        }),
                    }}
                />
            </div>
        );
    }
};

export default FormSelectField;
