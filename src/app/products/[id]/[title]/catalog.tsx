"use client";
import { useState } from "react";
import { getContentAttachment } from "@/core/http";
import style from './products-details.module.scss'

interface CatalogProps {
    fields: Record<string, ContentFieldsInterface>;
}

export default function Catalog({ fields }: CatalogProps) {
    const [loading, setLoading] = useState(false);

    const handleDownload = async () => {
        if (!fields.Pro_catalog?.value) return;

        try {
            setLoading(true);

            const result = await getContentAttachment(fields.Pro_catalog.value);

            if (!("blob" in result)) {
                alert("سرور پاسخ JSON برگرداند، فایل دریافت نشد!");
                return;
            }

            const { blob, filename } = result;
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = filename || fields.Pro_catalog.title || "file";
            document.body.appendChild(link);
            link.click();
            link.remove();
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error("دانلود ناموفق:", err);
            alert("دانلود ناموفق بود");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            className={style['catalog'] + ' btn bg-btn d-flex align-items-center text-light justify-content-center gap-2'}
            onClick={handleDownload}
            disabled={loading}
        >
            {loading ? (
                <>
                    <div
                        className="spinner-border spinner-border-sm text-light me-2"
                        role="status"
                    >
                    </div>
                    در حال دانلود...
                </>
            ) : (
                fields.Pro_catalog.title
            )}
        </button>
    );
}
