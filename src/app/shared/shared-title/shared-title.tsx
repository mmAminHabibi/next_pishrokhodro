import style from './shared-title.module.scss'
import {JSX} from "react";

interface SharedTitleProps {
    title: string;
    full?: boolean;
}

export default function SharedTitle({ title, full = false }: SharedTitleProps) {
    const Tag: keyof JSX.IntrinsicElements = full ? 'h1' : 'h2';

    return (
        <Tag
            className={
                style['shared-title'] +
                (full ? ' w-100 ' : ' col-12 col-md-6 p-0 ') +
                ' d-flex align-items-center justify-content-center text-center px-3 position-relative m-auto text-color mb-2'
            }
        >
            <span className="w-100 first-color text-nowrap">{title}</span>
        </Tag>
    );
}
