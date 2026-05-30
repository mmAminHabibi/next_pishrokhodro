"use client";
import "./loading.scss";
import Image from "next/image";

export default function Loading() {
    return (
        <div className="loading-wrapper d-flex flex-column align-items-center justify-content-center">
            <Image className="images" width={350} height={200} src="/images/full-logo.png" alt="logo" />
            <span className="loader" data-text="PISHRO KHODRO VIDA">PISHRO KHODRO VIDA</span>
        </div>
    );
}
