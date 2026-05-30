"use client";
import { useState, useRef } from "react";
import "./questions.scss";

interface Section {
    title: string;
    body: string;
}

export default function QuestionsAccordion({ sections }: { sections: Section[] }) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const contentRefs = useRef<Array<HTMLDivElement | null>>([]);

    const toggleIndex = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="questions-sections mt-4 overflow-hidden">
            {sections.map((section, index) => (
                <div key={index} className="questions-sections-items mb-4 bg-second-color">
                    <button
                        className="w-100 btn text-center bg-text-color p-3 text-white d-flex align-items-center justify-content-between"
                        onClick={() => toggleIndex(index)}
                    >
                        <span className="fs-24px">{section.title}</span>
                        <span className="fs-24px">{openIndex === index ? "-" : "+"}</span>
                    </button>

                    <div
                        className={`accordion-content ${openIndex === index ? "open px-3 text-white text-justify d-flex align-items-center fs-20px" : "text-white d-flex align-items-center text-justify fs-20px"}`}
                        dangerouslySetInnerHTML={{ __html: section.body }}
                    ></div>
                </div>
            ))}
        </div>
    );
}
