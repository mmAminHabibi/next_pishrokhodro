"use client";

import React, { useEffect, useRef, useState } from "react";
import "./BackToTop.scss";

export default function ScrollProgress() {
    const pathRef = useRef<SVGPathElement>(null);
    const wrapRef = useRef<HTMLDivElement>(null);
    const [pathLength, setPathLength] = useState(0);

    // طول مسیر دایره
    useEffect(() => {
        if (!pathRef.current) return;
        const length = pathRef.current.getTotalLength();
        setPathLength(length);
        pathRef.current.style.strokeDasharray = `${length} ${length}`;
        pathRef.current.style.strokeDashoffset = String(length);
    }, []);

    // کنترل اسکرول
    useEffect(() => {
        const handleScroll = () => {
            if (!pathRef.current || !wrapRef.current) return;

            const scrollTop = window.scrollY;
            const height = document.body.scrollHeight - window.innerHeight;

            // پر شدن دایره از صفر تا 100% با اسکرول
            const progress = (scrollTop * pathLength) / height;
            pathRef.current.style.strokeDashoffset = String(pathLength - progress);

            if (scrollTop > 50) {
                wrapRef.current.classList.add("active-progress");
            } else {
                wrapRef.current.classList.remove("active-progress");
            }
        };

        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [pathLength]);

    const scrollToTop = () =>
        window.scrollTo({ top: 0, behavior: "smooth" });

    return (
        <div
            ref={wrapRef}
            className="progress-wrap"
            onClick={scrollToTop}
        >
            {/* دایره پیشرفت */}
            <svg className="progress-circle" viewBox="-1 -1 102 102">
                <path ref={pathRef} d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98" />
            </svg>

            {/* آیکون وسط */}
            <div className="inner-icon">
                <svg viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12 4l-8 8h6v8h4v-8h6z"/>
                </svg>
            </div>
        </div>
    );
}
