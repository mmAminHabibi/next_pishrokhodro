'use client';

import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getProvince } from "@/core/http";
import { Field, FormContactProps } from './types';
import FormFieldRenderer from './FormFieldRenderer';
import '../../contact/contact.module.scss';

const FormContact = ({
                         data,
                         variant = "page",
                         formId,
                         isRegistration = false, // 🔹 prop جدید
                     }: FormContactProps & { isRegistration?: boolean }) => {
    const [fields, setFields] = useState<Field[]>([]);
    const [formData, setFormData] = useState<Record<string, string | File>>({});
    const [touched, setTouched] = useState<Record<number, boolean>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [message, setMessage] = useState("");
    const [flag, setFlag] = useState(false);
    const [formDisabled, setFormDisabled] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formKey, setFormKey] = useState(0);

    const [towns, setTowns] = useState<{ id: number; title: string }[]>([]);
    const [selectedProvinceId, setSelectedProvinceId] = useState<number | null>(null);
    const [selectedTownId, setSelectedTownId] = useState<number | null>(null);

    const siteId = "a7e7b5f96eaa537578e8445651d49d30";
    const token = "lgc654um4f8d569yn4g3h4dgf34gsegj38hmvcfjhnlsrgvnmghx";

    // ⚡ Prefill و init فرم
    useEffect(() => {
        if (!data) return;
        setFields(data);

        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");

        const initial: Record<string, string | File> = {};
        let phoneNumber = "";

        if (token && userData) {
            try {
                const userDataParsed = JSON.parse(userData);
                let userObject = userDataParsed.user;
                if (typeof userObject === 'string') userObject = JSON.parse(userObject);
                phoneNumber = userDataParsed.mobile || userObject?.phone || "";
            } catch { phoneNumber = ""; }
        }

        data.forEach(f => {
            if (isRegistration && phoneNumber && (f.machine_name === "tel" || f.machine_name === "password")) {
                initial[f.machine_name] = phoneNumber; // فقط prefill
            } else {
                initial[f.machine_name] = "";
            }
        });

        setFormData(prev => ({ ...initial, ...prev }));
    }, [data, isRegistration]);

    // ⚡ وضعیت login
    useEffect(() => {
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");
        setIsLoggedIn(!!(token && userData));
    }, []);

    // ⚡ تغییر مقدار فرم
    const handleChange = (name: string, value: string | File) => {
        if (formDisabled) return;

        // فقط شماره prefill شده در فرم ثبت‌نام وقتی کاربر لاگین است غیرقابل تغییر باشد
        if (
            isRegistration &&
            isLoggedIn &&
            (name === "tel" || name === "mobile") &&
            formData[name] // فقط وقتی مقدار اولیه وجود دارد
        ) return;

        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleBlur = (id: number) => setTouched(prev => ({ ...prev, [id]: true }));

    const validateField = (field: Field, value: string | File) => {
        let error = "";
        if (field.form_field_type_id === 8) {
            if (field.required === 1 && !(value instanceof File)) error = `${field.title} الزامی است.`;
            else if (value instanceof File && !["image/jpeg", "application/pdf"].includes(value.type))
                error = `${field.title} باید یکی از فرمت‌های jpg, jpeg یا pdf باشد.`;
        } else {
            const val = typeof value === "string" ? value.trim() : "";
            if (field.required === 1 && !val) error = `${field.title} الزامی است.`;
            else if (field.regex && val) {
                try { if (!(new RegExp(field.regex)).test(val)) error = `${field.title} معتبر نیست.`; } catch {}
            }
        }
        return error;
    };

    const handleProvinceChange = async (provinceId: number | null) => {
        setSelectedProvinceId(provinceId);
        setSelectedTownId(null);
        setTowns([]);
        setFormData(prev => ({ ...prev, town: "" }));

        if (provinceId) {
            try { const res = await getProvince(provinceId.toString()); setTowns(res?.data || []); }
            catch { setTowns([]); }
        }
    };

    const handleTownChange = (townId: number | null, townTitle: string) => {
        setSelectedTownId(townId);
        setFormData(prev => ({ ...prev, town: townTitle }));
    };

    // ⚡ ارسال فرم
    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: Record<string, string> = {};
        fields.forEach(f => { const err = validateField(f, formData[f.machine_name]); if (err) newErrors[f.machine_name] = err; });
        setErrors(newErrors);
        setTouched(fields.reduce((acc, f) => ({ ...acc, [f.id]: true }), {}));
        if (Object.keys(newErrors).length > 0) return;

        setIsSubmitting(true);
        try {
            const fd = new FormData();
            fd.append("token", token);
            fd.append("site_id", siteId);
            fd.append("form_id", formId);

            fields.forEach(f => {
                let value = formData[f.machine_name] as string;
                if (f.machine_name === "province" && selectedTownId) value = selectedTownId.toString();
                if (value !== undefined && value !== null) fd.append(f.machine_name, value.toString());
            });

            fields.filter(f => f.form_field_type_id === 8).forEach(f => {
                const fileValue = formData[f.machine_name];
                if (fileValue instanceof File) fd.append(f.machine_name, fileValue, fileValue.name);
            });

            const headers: Record<string, string> = {};
            const userToken = localStorage.getItem("token");
            if (userToken) headers.Authorization = `Bearer ${userToken}`;

            const url = isRegistration
                ? "https://cms.vidamotor.net/api/v6/form/private/save"
                : "https://cms.vidamotor.net/api/v6/form/save";

            await axios.post(url, fd, { headers });

            const successMessage = isRegistration
                ? "ثبت نام با موفقیت انجام شد، به زودی با شما تماس خواهیم گرفت."
                : "پیام شما با موفقیت ثبت شد.";

            toast.success(successMessage);
            setMessage(successMessage);
            setFlag(true);
            setFormDisabled(true);
            setFormKey(k => k + 1);
            setFormData(fields.reduce((acc, f) => ({ ...acc, [f.machine_name]: "" }), {}));
            setErrors({});
            setTouched({});
            setSelectedProvinceId(null);
            setSelectedTownId(null);
            setTowns([]);
        } catch (error: unknown) {
            const errorMsg = axios.isAxiosError(error) ? error.response?.data?.message || "خطا در ارسال اطلاعات." : "خطا در ارسال اطلاعات.";
            setMessage(errorMsg);
            setFlag(false);
            console.error(error);
        } finally { setIsSubmitting(false); }
    };

    const buttonClass =
        variant === "footer" ? "rounded-circle ms-2 text-white border-0" : "btn bg-btn text-white py-2 px-5 border-radius-14px";

    return (
        <form key={formKey} onSubmit={onSubmit} encType="multipart/form-data" className={
            variant === "footer"
                ? "position-relative h-100"
                : "form bg-color px-4 h-100 py-4 border-radius-14px contactform position-relative row"
        }>
            {fields.map(f => (
                <FormFieldRenderer
                    key={f.id}
                    field={f}
                    value={formData[f.machine_name] || ""}
                    error={errors[f.machine_name]}
                    touched={touched[f.id] || false}
                    disabled={formDisabled || isSubmitting}
                    onChange={(value) => handleChange(f.machine_name, value)}
                    onBlur={() => handleBlur(f.id)}
                    variant={variant}
                    isLoggedIn={isLoggedIn}
                    selectedProvinceId={selectedProvinceId}
                    selectedTownId={selectedTownId}
                    towns={towns}
                    onProvinceChange={handleProvinceChange}
                    onTownChange={handleTownChange}
                    townValue={typeof formData["town"] === "string" ? formData["town"] : ""}
                />
            ))}

            <div className="col-12 mt-3">
                <button
                    type="submit"
                    className={`${buttonClass} ${variant === 'registration' && !isLoggedIn ? 'disabled' : ''} ${variant === 'footer' ? 'footer-btn' : ''}`}
                    disabled={formDisabled || isSubmitting || (variant === 'registration' && !isLoggedIn)}
                    style={variant === "footer" ? {
                        backgroundColor: "#2A2E6BFF",
                        transition: "background-color 0.3s ease"
                    } : undefined}
                >
                    {isSubmitting ? (
                        <span className="spinner-border spinner-border-sm"></span>
                    ) : variant === "footer" ? (
                        "←"
                    ) : variant === "registration" ? (
                        "ثبت نام"
                    ) : (
                        "ارسال پیام"
                    )}
                </button>
            </div>

            {message && (
                <div className={`col-12 mt-3 d-flex justify-content-between align-items-center p-2 rounded ${flag ? "bg-success text-white" : "text-danger border border-danger"}`}>
                    <span>{message}</span>
                    {flag && (
                        <button
                            type="button"
                            className={`btn-close ${variant === "footer" ? "" : "btn-close-white ms-2"}`}
                            aria-label="Close"
                            onClick={() => {
                                setFlag(false);
                                setMessage("");
                                setFormData(fields.reduce((acc, f) => ({ ...acc, [f.machine_name]: "" }), {}));
                                setTouched({});
                                setErrors({});
                                setFormDisabled(false);
                                setSelectedProvinceId(null);
                                setSelectedTownId(null);
                                setTowns([]);
                            }}
                        />
                    )}
                </div>
            )}

            <ToastContainer position="top-right" autoClose={5000} />
        </form>
    );
};

export default FormContact;
