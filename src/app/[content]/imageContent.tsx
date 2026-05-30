'use client';

import { useEffect, useState } from "react";
import Image from "next/image";

interface ImageContentProps {
    imagePath: string;
    alt: string;
}

export default function ImageContent({ imagePath, alt }: ImageContentProps) {
    const [active, setActive] = useState(false);

    useEffect(() => {
        setTimeout(() => setActive(true), 100);
    }, []);

    return (
        <div className={`image-animate ${active ? "active" : ""}`} style={{ position: "relative", height: "100%" }}>
            <Image
                src={imagePath}
                alt={alt}
                fill={true}
                style={{ objectFit: "cover" }}
            />
        </div>
    );
}
