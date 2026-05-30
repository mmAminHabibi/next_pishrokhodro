"use client";

import Image from "next/image";
import React, { useState } from "react";

interface SharedImageProps {
    src: string;
    thumpSrc?: string;
    alt: string;
    width?: number;
    height?: number;
    imageSize?: "thump" | "image_smaller" | "image_small" | "image_normal" | "image_large" | "";
    fallbackSrc?: string;
    className?: string;
    aspect?: string;
    priority?: boolean;
}

function getImage(src?: string, size?: string): string {
    if (!src) return "";
    if (!size) return src;
    return src.includes("thump") ? src.replace(/thump/gi, size) : src;
}

export default function SharedImage({
                                        src,
                                        thumpSrc,
                                        alt,
                                        width = 300,
                                        height = 200,
                                        imageSize = "image_normal",
                                        fallbackSrc,
                                        className = "",
                                        aspect,
                                        priority = false,
                                    }: SharedImageProps) {

    const [loaded, setLoaded] = useState(false);
    const [errorCount, setErrorCount] = useState(0);

    const finalSrc =
        errorCount === 0
            ? getImage(src, imageSize)
            : errorCount === 1 && fallbackSrc
                ? fallbackSrc
                : "/images/notfound.webp";

    return (
        <div
            className={`position-relative w-100 overflow-hidden d-flex align-items-center justify-content-center ${className}`}
            style={{ aspectRatio: aspect || undefined }}
        >

            {!loaded && (
                <div
                    className={`position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center ${
                        loaded ? "opacity-0" : "opacity-100"
                    }`}
                    style={{
                        transition: "opacity 0.5s ease",
                        background: "rgba(255, 255, 255, 0.05)",
                        backdropFilter: "blur(8px)",
                        zIndex: 3,
                    }}
                >

                    <img
                        src={thumpSrc}
                        alt={alt}
                        className={`position-absolute top-0 start-0 w-100 h-100 object-fit-cover `}
                        style={{
                            filter: "blur(12px)",
                            transform: "scale(1.05)",
                            transition: "opacity 0.5s ease",
                        }}
                    />
                    <div
                        className="spinner-border text-primary"
                        role="status"
                        style={{width: "3rem", height: "3rem"}}
                    >
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            )}

            {/* Main image */}
            <Image
                src={finalSrc}
                alt={alt}
                width={width}
                height={height}
                onLoadingComplete={() => setLoaded(true)}
                onError={() => setErrorCount((prev) => prev + 1)}
                priority={priority}
                loading={priority ? "eager" : "lazy"}
                className={`w-100 h-100 object-fit-cover ${
                    loaded ? "opacity-100" : "opacity-0"
                }`}
                style={{
                    transition: "opacity 0.7s ease",
                }}
            />
        </div>
    );
}
