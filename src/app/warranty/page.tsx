'use client';

import { useSearchParams } from "next/navigation";
import { getApiService } from "@/core/http";
import SharedFilterCategory from "@/app/shared/shared-filter-category/shared-filter-category";
import Catalog from "@/app/products/[id]/[title]/catalog";
import { useEffect, useState } from "react";
import Loading from "@/app/loading";
import ServerError from "@/app/server-error/server-error";

interface FieldsInterface {
    text: string;
    title: string;
    field_type_id: number;
    value: number;
}

interface WarrantyItem {
    id: number;
    title: string;
    summary: string;
    body: string;
    fields?: string;
    categories: { id: number; title: string }[];
}

interface WarrantyResponse {
    data: {
        warranty: {
            contents: {
                data: WarrantyItem[];
            };
        };
        warranty_category?: {
            group?: {
                active_categories?: { id: number; title: string }[];
            };
        };
    };
}

export default function Warranty() {
    const searchParams = useSearchParams();
    const categoryIdParam = searchParams.get("category_id");
    const categoryId = categoryIdParam ? parseInt(categoryIdParam) : undefined;

    const [data, setData] = useState<WarrantyResponse | null>(null);
    const [warranty, setWarranty] = useState<WarrantyItem[]>([]);
    const [fields, setFields] = useState<Record<string, FieldsInterface>>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);

    useEffect(() => {
        setLoading(true);
        getApiService("warranty")
            .then((response: WarrantyResponse) => {
                if (!response || !response.data?.warranty?.contents?.data?.length) {
                    setError(true);
                    setLoading(false);
                    return;
                }
                setData(response);
                const warrantyData = response.data.warranty.contents.data;
                setWarranty(warrantyData);

                if (warrantyData.length > 0 && warrantyData[0].fields) {
                    try {
                        setFields(JSON.parse(warrantyData[0].fields));
                    } catch (err) {
                        console.error("خطا در parse کردن fields", err);
                    }
                }

                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, [categoryId]);
    if (error) return <ServerError />;
    if (loading || !data) return <Loading />;
    const filteredWarranty = categoryId
        ? warranty.filter((item) => item.categories[1]?.id === categoryId)
        : [];



    return (
        <div className="container py-5">
            <div className="warranty">
                <div className="warranty-title">
                    <h2 className="text-center fa-3x first-color fw-bold">مرکز گارانتی</h2>
                </div>
                <div className="row mt-5">
                    <div className="col-lg-2 col-12">
                        <SharedFilterCategory
                            data={data.data.warranty_category?.group?.active_categories || []}
                            activeId={categoryId ?? null}
                            variant="warranty"
                            onStartLoading={() => setLoading(true)}
                        />
                    </div>
                    <div className="col-lg-10 col-12">
                        <div className="warranty-content position-relative min-h-[200px]">
                            {loading ? (
                                <div className="mb-4">
                                    <h1 className="mb-3 w-25 loading-motion">loading</h1>
                                    <span className="second-color loading-motion px-5 py-1">loading</span>
                                    <div className="fs-20px mt-3 text-justify loading-motion">
                                        <p>loading</p>
                                        <p>loading</p>
                                        <p>loading</p>
                                        <p>loading</p>
                                    </div>
                                    <div
                                        className="warranty-content-catalog ms-auto d-flex align-items-center justify-content-start mt-3 loading-motion py-2 px-2"
                                        style={{ width: "80px" }}
                                    >
                                        <span className="w-fit">loading</span>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {filteredWarranty.length > 0 ? (
                                        filteredWarranty.map((item, index) => (
                                            <div key={index} className="mb-4">
                                                <h1 className="mb-3">{item.title}</h1>
                                                <span className="second-color"  dangerouslySetInnerHTML={{__html: item.summary}}></span>
                                                <div
                                                    className="fs-20px mt-3 text-justify"
                                                    dangerouslySetInnerHTML={{ __html: item.body }}
                                                ></div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-muted">محتوایی برای این دسته‌بندی موجود نیست.</p>
                                    )}
                                    <div className="warranty-content-catalog d-flex align-items-center justify-content-end mt-3">
                                        <Catalog fields={fields} />
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
