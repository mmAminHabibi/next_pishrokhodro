import type { Metadata } from "next";
import "@/styles/styles.scss";
import "bootstrap/dist/css/bootstrap.rtl.min.css";
import "font-awesome/css/font-awesome.min.css";
import IncludeHeader from "@/app/layout/include-header/include-header";
import IncludeFooter from "@/app/layout/include-footer/include-footer";
import BackToTop from "@/app/BackToTop";
import { getApiService } from "@/core/http";
import Script from "next/script";
import { Suspense } from "react";
import Loading from "@/app/loading";

export const revalidate = 3600;

export const metadata: Metadata = {
    description: "طراحی و توسعه توسط شرکت پویشگران عصر داده poyeshgaran.ir",
};

export default async function RootLayout({children,}: Readonly<{ children: React.ReactNode }>) {
    const version = "1.0.0";
    console.log(version)
    const data = await getApiService("public");

    const title = data?.site?.title || "شرکت افتخار پبشبرد راهی نو";
    const icon = data?.site?.fav_icon_path || "/images/full-logo.png";

    return (
        <html lang="fa" dir="rtl">
        <head>
            {/* Google Analytics */}
            <Script
                src="https://www.googletagmanager.com/gtag/js?id=G-ZF11GNS56T"
                strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
                {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-ZF11GNS56T');
          `}
            </Script>
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta name="version" content={version} />
            <meta name="site-name" content={title} />
            <link rel="icon" type="image/x-icon" href={icon} />
            <meta name="enamad" content="64838902" />
            <title>{title}</title>
        </head>
        <body suppressHydrationWarning>
        <IncludeHeader data={data} />
        <main className="children">
            <Suspense fallback={<Loading />}>
                {children}
            </Suspense>
        </main>
        <IncludeFooter data={data} />
        <BackToTop />
        </body>
        </html>
    );
}
