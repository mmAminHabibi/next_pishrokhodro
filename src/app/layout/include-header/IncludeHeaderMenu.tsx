"use client";

import { useState } from "react";
import Link from "next/link";
import { FaTimes } from "react-icons/fa";
import { FaChevronDown, FaChevronUp } from "react-icons/fa"; // آیکون باز/بسته
import style from "./include-header.module.scss";

interface MenuItem {
    title: string;
    link: string;
    all_active_menus: { title: string; link: string }[];
}

export default function IncludeHeaderMenu({ menus }: { menus: MenuItem[] }) {
    const [open, setOpen] = useState(false);

    // برای باز/بسته کردن هر زیرمنو یک state شیء نگه می‌داریم
    const [openSubs, setOpenSubs] = useState<Record<number, boolean>>({});

    const toggleSub = (idx: number) => {
        setOpenSubs(prev => ({ ...prev, [idx]: !prev[idx] }));
    };

    return (
        <div >
            {/* دکمه همبرگر */}
            <div className={style["header-menu"] + " d-flex align-items-center"}>
                <button
                    onClick={() => setOpen(!open)}
                    className={
                        style["header-menu-icon"] +
                        " bg-transparent border-0 p-0 " +
                        (open ? style.change : "")
                    }
                >
                    <div className={style["bar1"]}></div>
                    <div className={style["bar2"]}></div>
                    <div className={style["bar3"]}></div>
                </button>
            </div>

            {/* منوی موبایل */}
            <div
                className={
                    style["mobile-menu"] + " " + (open ? style["mobile-menu-open"] : "")
                }
            >
                {/* دکمه بستن */}
                <div className="d-flex justify-content-end p-3">
                    <button
                        className="bg-transparent border-0 text-white fs-3"
                        onClick={() => setOpen(false)}
                    >
                        <FaTimes />
                    </button>
                </div>

                <ul className="list-unstyled m-0 p-4">
                    {menus.map((menu, idx) => (
                        <li key={idx} className="mb-3">
                            <div className="d-flex justify-content-between align-items-center">
                                <Link
                                    className="text-white fw-bold"
                                    href={menu.link ? menu.link : '#'}
                                    onClick={() => setOpen(false)}
                                >
                                    {menu.title}
                                </Link>

                                {menu.all_active_menus?.length > 0 && (
                                    <button
                                        onClick={() => toggleSub(idx)}
                                        className="bg-transparent border-0 text-white ms-2"
                                        aria-label="toggle submenu"
                                    >
                                        {openSubs[idx] ? <FaChevronUp /> : <FaChevronDown />}
                                    </button>
                                )}
                            </div>

                            {menu.all_active_menus?.length > 0 && openSubs[idx] && (
                                <ul className="list-unstyled ps-3 mt-2">
                                    {menu.all_active_menus.map((sub, sIdx) => (
                                        <li key={sIdx} className="mb-2">
                                            <Link
                                                className="text-white-50"
                                                href={sub.link ? sub.link : '#'}
                                                onClick={() => setOpen(false)}
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
            </div>
        </div>
    );
}
