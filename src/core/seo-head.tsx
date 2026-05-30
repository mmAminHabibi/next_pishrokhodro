interface SeoHeadProps {
    post: ContentInterface;
}

export default function SeoHead({ post }: SeoHeadProps) {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000/";
    const siteName = process.env.NEXT_PUBLIC_APP_NAME || "MyApp";
    const author = process.env.NEXT_PUBLIC_APP_AUTHOR || "MyApp";

    const url = `${baseUrl}post/${post.id}`;
    const image = post.image_path;

    const keywords =
        post.tags && post.tags.length > 0
            ? post.tags
            : [post.title, "خودرو", "بررسی خودرو", "شاسی‌بلند لوکس"];

    // JSON-LD Article
    const jsonLdArticle = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: post.title,
        description: post.summary,
        image: image,
        author: {
            "@type": "Organization",
            name: author,
        },
        publisher: {
            "@type": "Organization",
            name: siteName,
            logo: {
                "@type": "ImageObject",
                url: `${baseUrl}logo.png`,
            },
        },
        datePublished: post.publish_date,
        dateModified: post.updated_at || post.publish_date,
        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": url,
        },
    };

    // JSON-LD Breadcrumb
    const jsonLdBreadcrumb = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            {
                "@type": "ListItem",
                position: 1,
                name: "خانه",
                item: baseUrl,
            },
            {
                "@type": "ListItem",
                position: 2,
                name: "مقالات",
                item: `${baseUrl}posts`,
            },
            {
                "@type": "ListItem",
                position: 3,
                name: post.title,
                item: url,
            },
        ],
    };

    return (
        <>
            {/* پایه */}
            <title key="title">{post.title}</title>
            <meta key="meta-title" name="title" content={post.title} />
            <meta key="meta-description" name="description" content={post.summary} />
            <meta key="meta-keywords" name="keywords" content={keywords.join(", ")} />
            <meta key="meta-author" name="author" content={author} />
            <meta key="meta-language" name="language" content="fa" />
            <meta key="meta-robots" name="robots" content="index, follow" />
            <link key="canonical" rel="canonical" href={url} />

            {/* فنی */}
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta name="theme-color" content="#000000" />
            <link rel="alternate" href={url} hrefLang="fa" />

            {/* Open Graph */}
            <meta property="og:type" content="article" />
            <meta property="og:title" content={post.title} />
            <meta property="og:description" content={post.summary} />
            <meta property="og:image" content={image} />
            <meta property="og:url" content={url} />
            <meta property="og:site_name" content={siteName} />
            <meta property="og:locale" content="fa_IR" />

            {/* Open Graph برای مقاله */}
            <meta property="article:published_time" content={post.publish_date} />
            <meta property="article:modified_time" content={post.updated_at+'' || post.publish_date+''} />
            <meta property="article:author" content={author} />
            {keywords.map((tag, index) => (
                <meta key={`article-tag-${index}`} property="article:tag" content={tag} />
            ))}

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={post.title} />
            <meta name="twitter:description" content={post.summary} />
            <meta name="twitter:image" content={image} />
            <meta name="twitter:site" content="@YourSiteHandle" />
            <meta name="twitter:creator" content="@AuthorHandle" />

            {/* JSON-LD */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
            />
        </>
    );
}
