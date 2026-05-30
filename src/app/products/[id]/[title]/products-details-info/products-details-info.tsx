'use client'
import { useEffect, useState, useRef } from 'react';
import style from './products-details-info.module.scss';



interface PropsType {
    sections: ContentSectionInterface[];
}

export default function ProductsDetailsInfo({ sections }: PropsType) {
    const [activeIndex, setActiveIndex] = useState(0);
    const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
    const setSectionRef = (index: number) => (el: HTMLDivElement | null) => {
        sectionRefs.current[index] = el;
    };

    const handleScroll = () => {
        const scrollPosition = window.scrollY + 150;
        let currentIndex = 0;

        sectionRefs.current.forEach((section, index) => {
            if (section) {
                const offsetTop = section.offsetTop;
                if (scrollPosition >= offsetTop) {
                    currentIndex = index;
                }
            }
        });

        setActiveIndex(currentIndex);
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleClick = (index: number) => {
        sectionRefs.current[index]?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className={style['products-details-container']}>
            <div className="row gx-md-5">
                <div className="col-12 col-md-3 d-none d-md-block">
                    <div className={style['sidebar']}>
                        <ul>
                            {sections.map((item, index) => (
                                <li key={index}>
                                    <a
                                        onClick={() => handleClick(index)}
                                        className={(activeIndex === index ? 'slider-link-active' : '') + ' ' + (style['slider-link']) +' fs-18px d-flex align-items-center first-color position-relative text-nowrap d-flex gap-2'}
                                    >
                                        {item.title}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="col-12 col-md-9">
                    <div className={style['products-details-info']}>
                        {sections.map((item, index) => (
                            <div
                                className={style['products-details-info-item']}
                                id={`section-${index}`}
                                key={index}
                                ref={setSectionRef(index)}
                                style={{ scrollMarginTop: '140px' }}>
                                <h2 className="fs-24px first-color text-nowrap gap-3 fw-bold position-relative ps-3 py-0 my-3 d-flex align-items-center">
                                    {item.title}
                                </h2>
                                <div className="text-break products-details-info-section" dangerouslySetInnerHTML={{__html: item.body}}/>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
