'use client';

import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';

export default function ProductsLoadingOverlay() {
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const currentPageRef = useRef<number>(
        searchParams?.get('page') ? parseInt(searchParams.get('page')!) : 1
    );
    const currentCategoryRef = useRef<string | null>(
        searchParams?.get('category_id') || null
    );
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const newPage = searchParams?.get('page') ? parseInt(searchParams.get('page')!) : 1;
        const newCategory = searchParams?.get('category_id') || null;
        
        // بررسی تغییر page یا category_id
        const pageChanged = newPage !== currentPageRef.current;
        const categoryChanged = newCategory !== currentCategoryRef.current;
        
        if (pageChanged || categoryChanged) {
            // پاک کردن timeout قبلی اگر وجود داشته باشه
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            
            // نمایش فوری loading
            setIsLoading(true);
            currentPageRef.current = newPage;
            currentCategoryRef.current = newCategory;
            
            // بعد از یک تاخیر کوتاه برای نمایش لودینگ
            timeoutRef.current = setTimeout(() => {
                setIsLoading(false);
                timeoutRef.current = null;
            }, 200);
        }
        
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
        };
    }, [searchParams]);

    if (!isLoading) return null;

    return (
        <div 
            className="position-absolute top-0 start-0 w-100"
            style={{
                zIndex: 1000,
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                minHeight: '100%',
                padding: '20px 0'
            }}
        >
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
        </div>
    );
}

