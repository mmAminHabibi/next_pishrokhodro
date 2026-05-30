import { ApiError } from './api-error';

const BASE_URL: string = process.env.NEXT_PUBLIC_API_URL || '';
const FALLBACK_SITE_ID = 'e9a443021443732fd78ac2e628c3d816';
const SITE_ID: string = process.env.NEXT_PUBLIC_SITE_HASH_ID || FALLBACK_SITE_ID;
export async function getApiService(endpoint: string, customParams?: Record<string, string>) {
    const defaultParams = {
        site_id: SITE_ID,
    };

    const params = new URLSearchParams({
        ...defaultParams,
        ...{name: endpoint},
        ...(customParams || {}),
    }).toString();

    const url = `${BASE_URL}/service?${params}`;

    try {
        const res = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-locale': 'fa',
            },
            cache: 'no-cache',
        });

        const contentType = res.headers.get("content-type");

        if (!res.ok) {
            const errorText = await res.text(); // چون ممکنه JSON نباشه
            console.error('Server Error:', res.status, errorText);
            if (res.status === 429) {
                throw new ApiError(429, 'Too Many Requests');
            }
            throw new Error(`خطای سرور (${res.status})`);
        }

        if (!contentType?.includes('application/json')) {
            const text = await res.text();
            console.error('Expected JSON but got:', text);
            throw new Error('پاسخ سرور JSON نیست!');
        }

        return await res.json();
    } catch (err) {
        console.error('Fetch Error:', err);
        throw err;
    }
}

export async function getApiSearch(customParams: ParamsSearchInterface) {
    const defaultParams = {
        site_id: SITE_ID,
        name:'search'
    };

    const params = new URLSearchParams(
        Object.entries({...defaultParams, ...customParams})
            .reduce((acc, [key, value]) => {
                if (value !== undefined && value !== null) {
                    // Handle array category_id
                    if (key === 'category_id' && Array.isArray(value)) {
                        // Send as comma-separated string or multiple params
                        acc[key] = value.join(',');
                    } else {
                        acc[key] = String(value);
                    }
                }
                return acc;
            }, {} as Record<string, string>)
    ).toString();

    const url = `${BASE_URL}/service?${params}`;
    try {
        const res = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-locale': 'fa',
            },
            cache: 'no-cache',
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error('Server Error:', res.status, errorText);
            if (res.status === 429) {
                throw new ApiError(429, 'Too Many Requests');
            }
            throw new Error(`خطای سرور (${res.status})`);
        }

        return await res.json();
    } catch (err) {
        console.error('Fetch Error:', err);
        throw err;
    }
}

export async function getContent(contentId: string) {

    const defaultParams = {
        site_id: SITE_ID,
    };

    const params = new URLSearchParams({
        ...defaultParams,
        ...{content_id: contentId},
    }).toString();

    const url = `${BASE_URL}/content_view?${params}`;
    try {
        const res = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-locale': 'fa',
            },
            cache: 'no-cache',
        });

        const contentType = res.headers.get("content-type");

        if (!res.ok) {
            const errorText = await res.text();
            console.error('Server Error:', res.status, errorText);
            if (res.status === 429) {
                throw new ApiError(429, 'Too Many Requests');
            }
            throw new Error(`خطای سرور (${res.status})`);
        }

        if (!contentType?.includes('application/json')) {
            const text = await res.text();
            console.error('Expected JSON but got:', text);
            throw new Error('پاسخ سرور JSON نیست!');
        }

        return await res.json();
    } catch (err) {
        console.error('Fetch Error:', err);
        throw err;
    }
}

export async function getFile(fileId: string) {
    const defaultParams = {
        site_id: SITE_ID,
    };
    const params = new URLSearchParams({
        ...defaultParams,
        ...{file_id: fileId},
    }).toString();

    const url = `${BASE_URL}/file_view?${params}`;

    try {
        const res = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-locale': 'fa',
            },
            cache: 'no-cache',
        });

        const contentType = res.headers.get("content-type");

        if (!res.ok) {
            const errorText = await res.text();
            console.error('Server Error:', res.status, errorText);
            if (res.status === 429) {
                throw new ApiError(429, 'Too Many Requests');
            }
            throw new Error(`خطای سرور (${res.status})`);
        }

        if (!contentType?.includes('application/json')) {
            const text = await res.text();
            console.error('Expected JSON but got:', text);
            throw new Error('پاسخ سرور JSON نیست!');
        }

        return await res.json();
    } catch (err: any) {
        console.error('Fetch Error:', err);
        if (err.message && err.message.includes("Failed to fetch")) {
            throw new Error("خطا در اتصال به سرور. لطفاً اتصال اینترنت خود را بررسی کنید.");
        }
        throw err;
    }
}

export async function getContentAttachment(value: number | string) {
    const defaultParams = { site_id: SITE_ID };
    const params = new URLSearchParams({
        ...defaultParams,
        value: value + "",
    }).toString();

    const url = `${BASE_URL}/attachment/download?${params}`;

    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                "x-locale": "fa",
                // ⚠️ نکته: برای دانلود فایل نباید همیشه "Content-Type: application/json" بفرستیم
            },
            cache: "no-cache",
        });

        const contentType = res.headers.get("content-type") || "";

        if (!res.ok) {
            const errorText = await res.text();
            console.error("Server Error:", res.status, errorText);
            if (res.status === 429) {
                throw new ApiError(429, 'Too Many Requests');
            }
            throw new Error(`خطای سرور (${res.status})`);
        }

        // اگر JSON برگشته (مثلاً پیام خطا)
        if (contentType.includes("application/json")) {
            return await res.json();
        }

        // اگر فایل باینری برگشته (PDF, Excel, Image, ...)
        const blob = await res.blob();

        // ممکنه اسم فایل توی هدر Content-Disposition باشه
        const disposition = res.headers.get("content-disposition") || "";
        let filename = "download";

        const match = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (match && match[1]) {
            filename = match[1].replace(/['"]/g, "");
        }

        return { blob, filename, contentType };
    } catch (err) {
        console.error("Fetch Error:", err);
        throw err;
    }
}

export async function getProvince(provinceId: string) {

    const defaultParams = {
        site_id: SITE_ID,
    };

    const params = new URLSearchParams({
        ...defaultParams,
        ...{province_id: provinceId},
    }).toString();

    const url = `${BASE_URL}/province/towns?${params}`;
    try {
        const res = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-locale': 'fa',
            },
            cache: 'no-cache',
        });

        const contentType = res.headers.get("content-type");

        if (!res.ok) {
            const errorText = await res.text();
            console.error('Server Error:', res.status, errorText);
            if (res.status === 429) {
                throw new ApiError(429, 'Too Many Requests');
            }
            throw new Error(`خطای سرور (${res.status})`);
        }

        if (!contentType?.includes('application/json')) {
            const text = await res.text();
            console.error('Expected JSON but got:', text);
            throw new Error('پاسخ سرور JSON نیست!');
        }

        return await res.json();
    } catch (err) {
        console.error('Fetch Error:', err);
        throw err;
    }
}

export async function getToken(endpoint: "phone" | "code", mobile: string, code: string | null) {
    const defaultParams = {site_id: SITE_ID, mobile,};

    const params = new URLSearchParams(
        code ? { ...defaultParams, code } : defaultParams
    ).toString();

    const url = `${BASE_URL}/login/${endpoint}?${params}`;

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-locale": "fa",
            },
            cache: "no-cache",
        });

        const contentType = res.headers.get("content-type");

        if (!res.ok) {
            const errorText = await res.text();
            console.error("Server Error:", res.status, errorText);
            if (res.status === 429) {
                throw new ApiError(429, 'Too Many Requests');
            }
            throw new Error(`خطای سرور (${res.status})`);
        }

        if (!contentType?.includes("application/json")) {
            const text = await res.text();
            console.error("Expected JSON but got:", text);
            throw new Error("پاسخ سرور JSON نیست!");
        }

        return await res.json();
    } catch (err) {
        console.error("Fetch Error:", err);
        throw err;
    }
}

/**
 * بررسی سلامت API - چک می‌کند که آیا API در دسترس است و خطای 429 نمی‌دهد
 * @returns true اگر API سالم باشد، false در غیر این صورت
 */
export async function checkApiHealth(): Promise<boolean> {
    try {
        // استفاده از یک endpoint ساده برای بررسی سلامت
        const params = new URLSearchParams({
            site_id: SITE_ID,
            name: 'main_page',
        }).toString();

        const url = `${BASE_URL}/service?${params}`;

        const res = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-locale': 'fa',
            },
            cache: 'no-cache',
        });

        // اگر status 429 باشد، API هنوز در دسترس نیست
        if (res.status === 429) {
            return false;
        }

        // اگر status موفق باشد (200-299)، API سالم است
        if (res.ok) {
            return true;
        }

        // برای سایر خطاها، false برمی‌گردانیم
        return false;
    } catch (err) {
        // در صورت خطای شبکه یا سایر خطاها
        console.error('Health check failed:', err);
        return false;
    }
}