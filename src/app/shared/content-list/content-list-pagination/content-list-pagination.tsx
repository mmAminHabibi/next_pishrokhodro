'use client';

import React, { useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import './content-list-pagination.scss';

interface PaginationProps {
    lastPage: number;
    currentPage: number;
}

const Pagination: React.FC<PaginationProps> = ({ lastPage, currentPage }) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const goToPage = (page: number) => {
        startTransition(() => {
            const params = new URLSearchParams();

            // حفظ پارامترهای مفید (غیر از پارامترهای داخلی Next)
            searchParams.forEach((value, key) => {
                if (!key.startsWith('_')) {
                    params.set(key, value);
                }
            });

            // تنظیم صفحه جدید
            if (page === 1) {
                params.delete("page");
            } else {
                params.set("page", page.toString());
            }

            const queryString = params.toString();
            router.push(queryString ? `${pathname}?${queryString}` : pathname);
        });
    };

    const getPages = (): (number | string)[] => {
        let pages: (number | string)[] = [];
        for (let i = 1; i <= Math.min(3, lastPage); i++) pages.push(i);

        const start = Math.max(1, currentPage - 3);
        const end = Math.min(lastPage, currentPage + 3);
        for (let i = start; i <= end; i++) pages.push(i);

        if (lastPage > 3) pages.push(lastPage);

        pages = [...new Set(pages)].sort((a, b) => Number(a) - Number(b));

        const display: (number | string)[] = [];
        for (let i = 0; i < pages.length; i++) {
            display.push(pages[i]);
            if (
                typeof pages[i] === "number" &&
                typeof pages[i + 1] === "number" &&
                (pages[i + 1] as number) - (pages[i] as number) > 1
            ) {
                display.push("...");
            }
        }
        return display;
    };

    const pages = getPages();

    return (
        <div className="pagination-wrapper">
            {currentPage > 1 && (
                <button className="perv" onClick={() => goToPage(currentPage - 1)} disabled={isPending}>قبلی</button>
            )}

            {pages.map((p, idx) =>
                p === "..." ? (
                    <span key={`ellipsis-${idx}`} className="ellipsis">...</span>
                ) : (
                    <button
                        key={`page-${p}-${idx}`}
                        onClick={() => goToPage(p as number)}
                        className={p === currentPage ? "active" : ""}
                        disabled={isPending}
                    >
                        {p}
                    </button>
                )
            )}

            {currentPage < lastPage && (
                <button className="next" onClick={() => goToPage(currentPage + 1)} disabled={isPending}>بعدی</button>
            )}
        </div>
    );
};

export default Pagination;
