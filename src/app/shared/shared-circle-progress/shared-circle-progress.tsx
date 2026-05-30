import {getImageProps} from "next/image";

import style from './shared-circle-progress.module.scss'
export default function SharedCircleProgress({ step }: { step: number }) {

    const radius = 40;

    const circumference = 2 * Math.PI * radius;

    const offset = circumference - (step / 100) * circumference;

    return (
        <svg className={'w-100 h-100'} viewBox="0 0 100 100">
            <circle
                className={style['circle']}
                r={radius}
                cx="50"
                cy="50"
                fill="transparent"
                strokeWidth="1"
            />


            <circle
                r={radius}
                cx="50"
                cy="50"
                fill="transparent"
                className={style['active-circle']}
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                style={{
                    transition: "stroke-dashoffset 0.35s ease",
                    transform: "rotate(-90deg)",
                    transformOrigin: "50% 50%",
                }}
            />

            <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="20"
                fill="#333"
            >
                {`${Math.round(step)}%`}
            </text>
        </svg>
    );
}
