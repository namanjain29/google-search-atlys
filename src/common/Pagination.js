import React from "react";
import { Pagination } from "antd";

const PagePagination = (props) => { 
    const { currentPage, setCurrentPage, totalContent, pageSize, setPageSize, style } = props;
    const onPageChange = (page) => {
        setCurrentPage(page);
    };
    const onPageSizeChange = (current, page) => {
        setPageSize(page);
    };
    return (
        <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={totalContent}
            onChange={onPageChange}
            onShowSizeChange={onPageSizeChange}
            style={style}
        />
    );
};

export default PagePagination;