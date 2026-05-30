'use client';

import {useEffect, useState, useMemo, useCallback} from "react";
import style from "./include-header.module.scss";
import Link from "next/link";
import Image from "next/image";
import IncludeHeaderMenu from "@/app/layout/include-header/IncludeHeaderMenu";

interface Header {
    data: HeaderProps;
}

export default function IncludeHeader({data}: Header) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mounted, setMounted] = useState(false);


    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, [mounted]);

    const logo = data?.site ?? null;

    const sortedItems = useMemo(() => {
        const menus = data?.data?.header_menu?.menu?.[0]?.all_active_menus ?? [];
        return [...menus].sort((a, b) => (a.order_by ?? 0) - (b.order_by ?? 0));
    }, [data]);

    const firstPart = useMemo(
        () => sortedItems.filter((item) => item.order_by && item.order_by <= 4),
        [sortedItems]
    );
    const secondPart = useMemo(
        () =>
            sortedItems.filter(
                (item) => item.order_by && item.order_by > 4 && item.order_by <= 11
            ),
        [sortedItems]
    );

    const renderMenu = useCallback(
        (menuList: MenuItem[]) => (
            <ul
                className={`${style.headerLink} d-flex h-100 gap-2 align-items-center justify-content-around`}
            >
                {menuList.map((menu, idx) => (
                    <li key={idx} className={style.menuItem}>
                        <Link
                            href={menu.link ? menu.link : '#'}
                            style={{
                                color: /^#([0-9A-Fa-f]{3}){1,2}$/.test(menu.font_icon || '')
                                    ? menu.font_icon
                                    : '#FFFFFF'
                            }}
                            className="fs-18px d-flex align-items-center justify-content-center overflow-hidden"
                        >
                            {menu.title}
                        </Link>
                        {menu.all_active_menus?.length > 0 && (
                            <ul className={style.subMenu}>
                                {menu.all_active_menus.map((sub, sIdx) => (
                                    <li key={sIdx}>
                                        <Link
                                            href={sub.link ? sub.link : '#'}
                                            className="fs-16px"
                                        >
                                            {sub.title}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>
        ),
        []
    );

    // ✅ اگر هنوز داده نیومده، اسکلتون لودینگ نشون بده
    if (!mounted || !logo || !sortedItems.length) {
        return (
            <>
                <div className={style['header-fix']}>d</div>
                <header className={`${style.header} container-fluid py-4 d-flex flex-column justify-content-center `}>
                    <div className="row justify-content-around align-items-center">
                        <div className="col-12 col-md-5 d-none d-md-flex justify-content-around">
                            {Array.from({length: 4}).map((_, i) => (
                                <div key={i} className={style.skeletonBox}/>
                            ))}
                        </div>

                        <div className="col-12 col-md-2 d-flex justify-content-center">
                            <div className={style.skeletonCircle}/>
                        </div>

                        <div className="col-12 col-md-5 d-none d-md-flex justify-content-around">
                            {Array.from({length: 4}).map((_, i) => (
                                <div key={i} className={style.skeletonBox}/>
                            ))}
                        </div>
                    </div>
                </header>

            </>
        );
    }

    // ✅ حالت نرمال پس از لود داده‌ها
    return (
        <>
            <div className={style['header-fix']}>d</div>

            <header
                className={`${style.header} ${
                    isScrolled ? style.scrolled : ""
                } container-fluid py-4`}
            >
                <div className="row justify-content-around align-items-center">
                    <div className="col-12 col-md-5 d-none d-md-block">
                        {renderMenu(firstPart)}
                    </div>

                    <div className="col-12 col-md-2">
                        <div className="d-flex align-items-center justify-content-between justify-content-md-center">
                            <div className="d-block d-md-none">
                                <IncludeHeaderMenu menus={sortedItems}/>
                            </div>

                            <Link href="/" className="d-flex">
                                <Image
                                    priority
                                    quality={85}
                                    src={isScrolled ? "/images/full-logo.png" : logo.site_logo_path}
                                    alt={logo.title}
                                    className=" header-logo transition-all duration-300"
                                    width={160}
                                    height={80}
                                />
                            </Link>
                        </div>
                    </div>

                    <div className="col-12 col-md-5 d-none d-md-block">
                        {renderMenu(secondPart)}
                    </div>
                </div>
            </header>
        </>
    );
}
