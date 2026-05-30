'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getContent } from '@/core/http';
import Loading from "@/app/loading";
import { TitlePage } from "@/app/[content]/page";

interface ContentInterface {
    id: number | string;
    title?: string;
    content_type_id: number;
}

const CONTENT_TYPE_ROUTES: Record<number, string> = {
    13: 'news',
    14: 'articles',
    16: 'slider',
    17: 'page',
    18: 'products',
    19: 'feedbacks',
    20: 'blogs',
};

function getContentTypeRoute(content_type_id?: number): string {
    return CONTENT_TYPE_ROUTES[content_type_id || 17] || 'page';
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
    const route = getContentTypeRoute(item.content_type_id);
    const slug = slugify(item.title || `${item.id}`);
    return `/${route}/${item.id}/${slug}`;
}

export default function NodePageClient() {
    const router = useRouter();
    const params = useParams<{ id?: string }>();
    const [loading, setLoading] = useState(true);
    const [content, setContent] = useState<ContentInterface | null>(null);

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

                if (content.content_type_id === 17) {
                    setContent(content);
                    setLoading(false);
                } else {
                    const newUrl = getItemLink(content);
                    router.replace(newUrl);
                }
            } catch (err) {
                console.error('getContent failed:', err);
                router.push('/404');
            }
        }

        fetchAndRedirect();
    }, [params, router]);

    if (loading) return <Loading />;

    if (content?.content_type_id === 17) {
        return <TitlePage contentId={Number(content.id)} />;
    }

    return null;
}

