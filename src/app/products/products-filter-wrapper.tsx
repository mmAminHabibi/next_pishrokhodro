'use client';

import { useState, useRef } from 'react';
import SharedFilterCategory from "@/app/shared/shared-filter-category/shared-filter-category";
import ProductsContentClient from "./products-content-client";

interface ProductsFilterWrapperProps {
    categories: { id: number | undefined; title: string }[];
    activeId: number | null;
}

export default function ProductsFilterWrapper({ categories, activeId }: ProductsFilterWrapperProps) {
    const contentClientRef = useRef<{ refresh: () => void; setData: (data: ContentInterface[], pagination?: { currentPage: number; lastPage: number }) => void } | null>(null);

    const handleSelect = (id?: number, newData?: ContentInterface[], pagination?: { currentPage: number; lastPage: number }) => {
        // اگر داده جدید داریم، فوری نمایش بده
        if (newData && contentClientRef.current) {
            contentClientRef.current.setData(newData, pagination);
        }
    };

    const startLoading = () => {
        // Loading توسط ProductsContentClient مدیریت می‌شود
    };

    return (
        <>
            <div className="col-12 my-4">
                <SharedFilterCategory
                    data={categories}
                    activeId={activeId}
                    variant="product"
                    onSelect={handleSelect}
                    onStartLoading={startLoading}
                />
            </div>

            <div className="col-12 position-relative">
                <ProductsContentClient ref={contentClientRef} />
            </div>
        </>
    );
}

