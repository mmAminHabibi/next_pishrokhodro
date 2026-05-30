import Link from 'next/link';
import SharedImage from '@/app/shared/shared-image/shared-image';

export default function NotFound() {
    return (
        <div className="container-lg py-5">
            <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
                <div className="text-center mb-5">
                    <h1 className="first-color fa-4x fw-bold mb-3">404</h1>
                    <h2 className="first-color fa-3x fw-bold mb-4">صفحه موجود نیست</h2>
                    <p className="text-color fs-20px mb-5" style={{ maxWidth: '600px', margin: '0 auto 2rem' }}>
                        متأسفانه صفحه‌ای که به دنبال آن هستید وجود ندارد یا حذف شده است.
                        لطفاً به صفحه اصلی بازگردید یا از منوی سایت استفاده کنید.
                    </p>
                </div>
                
                <div className="d-flex flex-wrap gap-3 justify-content-center">
                    <Link 
                        href="/" 
                        className="btn bg-btn text-white px-5 py-3 border-radius-14px fs-18px"
                        style={{ minWidth: '200px' }}
                    >
                        <i className="fa fa-home me-2"></i>
                        بازگشت به صفحه اصلی
                    </Link>
                    <Link 
                        href="/products" 
                        className="btn border-bg-second-color first-color px-5 py-3 border-radius-14px fs-18px"
                        style={{ minWidth: '200px' }}
                    >
                        <i className="fa fa-shopping-bag me-2"></i>
                        مشاهده محصولات
                    </Link>
                    <Link 
                        href="/blogs" 
                        className="btn border-bg-second-color first-color px-5 py-3 border-radius-14px fs-18px"
                        style={{ minWidth: '200px' }}
                    >
                        <i className="fa fa-book me-2"></i>
                        مشاهده بلاگ‌ها
                    </Link>
                </div>
            </div>
        </div>
    );
}

