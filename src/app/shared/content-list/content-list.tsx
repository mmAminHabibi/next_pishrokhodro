import {getApiSearch} from "@/core/http";
import React from "react";
import ContentListPagination from "@/app/shared/content-list/content-list-pagination/content-list-pagination";

interface ContentListInterface {
    row?: string,
    column: string,
    params: ParamsSearchInterface,
    renderItem: (item: ContentInterface, index: number) => React.ReactNode,
}

export default async function ContentList({row, column, params, renderItem}: ContentListInterface) {
    const data: SearchInterface = await getApiSearch(params);

    const contents = data?.data?.search?.original?.contents?.data || [];
    const pagination = {
        currentPage: data?.data?.search?.original?.contents?.current_page || 1,
        lastPage: data?.data?.search?.original?.contents?.last_page || 1,
    };

    return (
        <>
            {contents.length > 0 ? (
                <div className={"row " + (row || "")}>
                    {contents.map((item: ContentInterface, index: number) => (
                        <div key={index} className={column}>
                            {renderItem(item, index)}
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500 py-5 fs-5">
                    محتوایی در این دسته‌بندی وجود ندارد.
                </p>
            )}
            <div className="my-5 text-center">
                <ContentListPagination
                    currentPage={pagination.currentPage}
                    lastPage={pagination.lastPage}
                />
            </div>
        </>
    );
}
