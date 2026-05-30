'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getContent } from '@/core/http';
import Loading from "@/app/loading";

interface ContentInterface {
    id: number | string;
    title?: string;
    content_type_id: number;
}

function slugify(text?: string): string {
    if (!text || !text.trim()) text = 'page';
    return encodeURIComponent(
        text
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9\u0600-\u06FF\s-]/g, '')
            .trim()
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
    );
}

function getItemLink(item: ContentInterface): string {
    const slug = slugify(item.title || `${item.id}`);
    return `/products/${item.id}/${slug}`;
}

export default function ProductsNodePage() {
    const router = useRouter();
    const params = useParams<{ id?: string }>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const idParam = params?.id;
        if (!idParam || typeof idParam !== 'string') return;

        async function fetchAndRedirect() {
            try {
                const fetched = await getContent(String(idParam));
                const content: ContentInterface = fetched?.content;

                if (!content || !content.content_type_id) {
                    router.push('/404');
                    return;
                }

                // اگر content_type_id مربوط به products نباشد
                if (content.content_type_id !== 18) {
                    // اگر محتوا products نباشد، به صفحه اصلی products redirect می‌کنیم
                    router.push('/products');
                    return;
                }

                // Redirect به مسیر کامل products
                const newUrl = getItemLink(content);
                router.replace(newUrl);
            } catch (err) {
                console.error('getContent failed:', err);
                router.push('/404');
            }
        }

        fetchAndRedirect();
    }, [params, router]);

    if (loading) return <Loading />;

    return null;
}

