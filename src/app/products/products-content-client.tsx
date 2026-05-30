'use client';

import { useState, useEffect, useImperativeHandle, forwardRef, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { getApiSearch } from "@/core/http";
import SharedProductCard from "@/app/shared/shared-product-card/shared-product-card";
import ContentListPagination from "@/app/shared/content-list/content-list-pagination/content-list-pagination";

interface ProductsContentClientProps {
    initialData?: ContentInterface[];
}

const ProductsContentClient = forwardRef<{ refresh: () => void; setData: (data: ContentInterface[], paginationData?: { currentPage: number; lastPage: number }) => void }, ProductsContentClientProps>(
    ({ initialData }, ref) => {
        const searchParams = useSearchParams();
        const [products, setProducts] = useState<ContentInterface[]>(initialData || []);
        const [isLoading, setIsLoading] = useState(!initialData);
        const [pagination, setPagination] = useState({ currentPage: 1, lastPage: 1 });
        const [dataFromCallback, setDataFromCallback] = useState(false);
        const lastCategoryRef = useRef<string | null>(null);
        const lastPageRef = useRef<number>(1);

        const fetchData = () => {
            const categoryIdParam = searchParams?.get('category_id');
            const categoryId = categoryIdParam ? parseInt(categoryIdParam) : undefined;
            const page = searchParams?.get('page') ? parseInt(searchParams.get('page')!) : 1;

            const categoryKey = categoryId?.toString() || 'all';
            
            // اگر داده از callback آمده و category/page تغییر نکرده، درخواست نزن
            if (dataFromCallback && categoryKey === lastCategoryRef.current && page === lastPageRef.current) {
                return;
            }

            setIsLoading(true);
            lastCategoryRef.current = categoryKey;
            lastPageRef.current = page;
            setDataFromCallback(false);

            // ساخت params برای درخواست
            const params: ParamsSearchInterface = {
                content_type_id: 65,
                item_count: 6,
                light: true,
                page,
                ...(categoryId ? { category_id: categoryId } : {}),
            };

            // درخواست فوری API
            getApiSearch(params)
                .then(response => {
                    const contents = response?.data?.search?.original?.contents?.data || [];
                    const currentPage = response?.data?.search?.original?.contents?.current_page || 1;
                    const lastPage = response?.data?.search?.original?.contents?.last_page || 1;
                    
                    setProducts(contents);
                    setPagination({ currentPage, lastPage });
                    setIsLoading(false);
                })
                .catch(() => {
                    setProducts([]);
                    setIsLoading(false);
                });
        };

        useImperativeHandle(ref, () => ({
            refresh: fetchData,
            setData: (data: ContentInterface[], paginationData?: { currentPage: number; lastPage: number }) => {
                setProducts(data);
                setIsLoading(false);
                setDataFromCallback(true);
                
                // pagination را از callback یا searchParams بگیر
                if (paginationData) {
                    setPagination(paginationData);
                } else {
                    const page = searchParams?.get('page') ? parseInt(searchParams.get('page')!) : 1;
                    setPagination({ currentPage: page, lastPage: Math.ceil(data.length / 6) || 1 });
                }
                
                // به‌روزرسانی refs
                const categoryIdParam = searchParams?.get('category_id');
                const categoryId = categoryIdParam ? parseInt(categoryIdParam) : undefined;
                lastCategoryRef.current = categoryId?.toString() || 'all';
                lastPageRef.current = paginationData?.currentPage || page;
            }
        }));

        useEffect(() => {
            const categoryIdParam = searchParams?.get('category_id');
            const categoryId = categoryIdParam ? parseInt(categoryIdParam) : undefined;
            const page = searchParams?.get('page') ? parseInt(searchParams.get('page')!) : 1;
            const categoryKey = categoryId?.toString() || 'all';
            
            // اگر داده از callback آمده و category/page تغییر نکرده، درخواست نزن
            if (dataFromCallback && categoryKey === lastCategoryRef.current && page === lastPageRef.current) {
                return;
            }
            
            // اگر initialData نداریم یا category/page تغییر کرده، fetch کنیم
            if (!initialData || categoryKey !== lastCategoryRef.current || page !== lastPageRef.current) {
                setDataFromCallback(false);
                fetchData();
            }
        }, [searchParams]);

    if (isLoading) {
        return (
            <div className="row">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="col-12 col-md-4 mb-4">
                        <div className="loading-motion bg-light p-4 rounded-3 h-100">
                            <div className="aspect-ratio-16-9 bg-secondary mb-3 rounded-2"/>
                            <div className="bg-secondary mb-2" style={{height: 20, width: "70%"}}/>
                            <div className="bg-secondary" style={{height: 16, width: "50%"}}/>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <>
            {products.length > 0 ? (
                <>
                    <div className="row">
                        {products.map((item: ContentInterface, index: number) => (
                            <div key={index} className="col-12 col-md-4 mb-4">
                                <SharedProductCard data={item}/>
                            </div>
                        ))}
                    </div>
                    <div className="my-5 text-center">
                        <ContentListPagination
                            currentPage={pagination.currentPage}
                            lastPage={pagination.lastPage}
                        />
                    </div>
                </>
            ) : (
                <p className="text-center text-gray-500 py-5 fs-5">
                    محتوایی در این دسته‌بندی وجود ندارد.
                </p>
            )}
        </>
    );
});

ProductsContentClient.displayName = 'ProductsContentClient';

export default ProductsContentClient;

