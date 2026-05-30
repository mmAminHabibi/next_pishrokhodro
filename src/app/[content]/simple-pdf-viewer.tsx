'use client';

import { useState, useEffect } from 'react';

interface SimplePDFViewerProps {
    fileUrl: string;
    title: string;
}

const MOBILE_BREAKPOINT = 768;

function isMobileDevice(): boolean {
    if (typeof window === 'undefined') return false;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
           window.innerWidth < MOBILE_BREAKPOINT;
}

export default function SimplePDFViewer({ fileUrl, title }: SimplePDFViewerProps) {
    const [pdfUrl, setPdfUrl] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        setIsMobile(isMobileDevice());

        async function loadPDF() {
            try {
                setLoading(true);
                const response = await fetch(fileUrl);

                if (!response.ok) {
                    throw new Error('خطا در بارگذاری PDF');
                }

                const blob = await response.blob();
                const blobUrl = URL.createObjectURL(blob);
                setPdfUrl(blobUrl);
                setError(false);
            } catch (err) {
                console.error('Error loading PDF:', err);
                setPdfUrl(fileUrl);
                setError(false);
            } finally {
                setLoading(false);
            }
        }

        if (fileUrl) {
            loadPDF();
        }

        return () => {
            if (pdfUrl && pdfUrl.startsWith('blob:')) {
                URL.revokeObjectURL(pdfUrl);
            }
        };
    }, [fileUrl]);

    if (loading) {
        return (
            <div style={{
                border: '1px solid #ddd',
                borderRadius: '12px',
                padding: '40px',
                textAlign: 'center',
                backgroundColor: '#f8f9fa',
                minHeight: '400px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div>
                    <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                        <span className="visually-hidden">در حال بارگذاری...</span>
                    </div>
                    <p className="mt-3">در حال بارگذاری PDF...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{
                border: '2px dashed #ddd',
                borderRadius: '12px',
                padding: '40px 20px',
                textAlign: 'center',
                backgroundColor: '#f8f9fa'
            }}>
                <i className="fa fa-file-pdf-o" style={{ fontSize: '60px', color: '#dc3545', marginBottom: '20px' }}></i>
                <h5 className="mb-3">{title}</h5>
                <p className="text-muted mb-4">متأسفانه فایل PDF قابل نمایش نیست</p>
                <div className="d-flex flex-column gap-3 align-items-center">
                    <a
                        href={fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary px-5"
                        style={{ minWidth: '250px' }}
                    >
                        <i className="fa fa-external-link me-2"></i>
                        باز کردن در تب جدید
                    </a>
                    <a
                        href={fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline-secondary px-5"
                        download
                        style={{ minWidth: '250px' }}
                    >
                        <i className="fa fa-download me-2"></i>
                        دانلود PDF
                    </a>
                </div>
            </div>
        );
    }

    if (isMobile) {
        return (
            <div style={{
                border: '2px dashed #ddd',
                borderRadius: '12px',
                padding: '40px 20px',
                textAlign: 'center',
                backgroundColor: '#f8f9fa'
            }}>
                <i className="fa fa-file-pdf-o" style={{ fontSize: '60px', color: '#dc3545', marginBottom: '20px' }}></i>
                <h5 className="mb-3" style={{ fontWeight: 'bold', color: '#333' }}>{title}</h5>
                <p className="text-muted mb-4">برای مشاهده فایل PDF، یکی از گزینه‌های زیر را انتخاب کنید:</p>

                <div className="d-flex flex-column gap-3 align-items-center">
                    <a
                        href={pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary px-5"
                        style={{ minWidth: '250px' }}
                    >
                        <i className="fa fa-external-link me-2"></i>
                        باز کردن PDF
                    </a>

                    <a
                        href={pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline-secondary px-5"
                        download
                        style={{ minWidth: '250px' }}
                    >
                        <i className="fa fa-download me-2"></i>
                        دانلود PDF
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            border: '1px solid #ddd',
            borderRadius: '12px',
            overflow: 'hidden',
            backgroundColor: '#f8f9fa',
            position: 'relative'
        }}>
            <iframe
                src={`${pdfUrl}#toolbar=1&navpanes=1&scrollbar=1`}
                width="100%"
                height="800px"
                style={{
                    border: "none",
                    minHeight: '600px',
                    display: 'block'
                }}
                title={title}
            />
            <div className="text-center p-3" style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderTop: '1px solid #ddd'
            }}>
                <div className="d-flex gap-2 justify-content-center flex-wrap">
                    <a
                        href={pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-outline-primary"
                    >
                        <i className="fa fa-external-link me-1"></i>
                        باز کردن در تب جدید
                    </a>
                    <a
                        href={pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-outline-secondary"
                        download
                    >
                        <i className="fa fa-download me-1"></i>
                        دانلود
                    </a>
                </div>
            </div>
        </div>
    );
}
