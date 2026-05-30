export interface Field {
    id: number;
    title: string;
    machine_name: string;
    form_field_type_id: number;
    required: number;
    field_size: number;
    regex?: string;
    items?: { id: number; title: string }[];
}

export interface FormContactProps {
    data?: Field[];
    variant?: "footer" | "page" | "registration";
    formId: string;
}

export interface BaseFieldProps {
    field: Field;
    value: string | File;
    error?: string;
    touched: boolean;
    disabled: boolean;
    onChange: (value: string | File) => void;
    onBlur: () => void;
    variant?: "footer" | "page" | "registration";
    flag?: boolean;
}
