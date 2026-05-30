'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import SharedTitle from "@/app/shared/shared-title/shared-title";
import { getApiService } from "@/core/http";
import Loading from "@/app/loading";
import ServerError from "@/app/server-error/server-error";
import ProductsFilterWrapper from "./products-filter-wrapper";

interface ApiError {
    status: number;
    message?: string;
}

export default function Products() {
    const searchParams = useSearchParams();
    const [data, setData] = useState<ProductsInterface | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<ApiError | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                setIsLoading(true);
                const result = await getApiService("products");
                setData(result);
                setError(null);
            } catch (err) {
                const apiError = err as ApiError;
                setError(apiError);
            } finally {
                setIsLoading(false);
            }
        }

        fetchData();
    }, []);

    if (isLoading) {
        return <Loading />;
    }

    if (error) {
        if (error.status === 429) {
            return <ServerError />;
        }
        return <ServerError />;
    }

    if (!data || !data.data) {
        return <Loading />;
    }

    const categoryIdParam = searchParams?.get('category_id');
    const categoryId = categoryIdParam ? parseInt(categoryIdParam) : undefined;

    return (
        <div className="container-lg py-5">
            <div className="product bg-color border-radius-14px overflow-hidden p-4">
                <div className="row">
                    <div className="col-12">
                        <SharedTitle title="محصولات پیشرو خودرو ویدا" full={true}/>
                    </div>

                    <ProductsFilterWrapper
                        categories={data.data.products_category?.group?.active_categories || []}
                        activeId={categoryId ?? null}
                    />
                </div>
            </div>
        </div>
    );
}
