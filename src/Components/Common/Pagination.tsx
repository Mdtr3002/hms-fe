import React, { useState, useMemo, useEffect } from "react";
import { Row, PaginationItem, PaginationLink } from 'reactstrap';


const Pagination = ({ perPageData, data, setCurrentpages, currentpages }) => {
    const pagination: boolean = true;
    const [currentPage, setCurrentPage] = useState<any>(1);

    //pagination
    const handleClick = (e: any) => {
        setCurrentPage(Number(e.target.id));
    };
    const indexOfLast = currentPage * perPageData;
    const indexOfFirst = indexOfLast - perPageData;
    const currentdata = useMemo(() => data?.slice(indexOfFirst, indexOfLast), [data, indexOfFirst, indexOfLast])
    useEffect(() => {
        setCurrentpages(currentdata)
    }, [currentPage, currentdata,setCurrentpages]);

    const pageNumbers: any = [];
    for (let i = 1; i <= Math.ceil(data?.length / perPageData); i++) {
        pageNumbers.push(i);
    }
    const handleprevPage = () => {
        let prevPage = currentPage - 1;
        setCurrentPage(prevPage);
    };
    const handlenextPage = () => {
        let nextPage = currentPage + 1;
        setCurrentPage(nextPage);
    };

    useEffect(() => {
        if (pageNumbers.length && pageNumbers.length < currentPage) {
            setCurrentPage(pageNumbers.length)
        }
    }, [pageNumbers.length, currentPage])

    return (
        <React.Fragment>
            {!currentpages?.length && <div id="noresult">
                <div className="text-center py-4">
                    <div className="avatar-md mx-auto mb-4">
                        <div className="avatar-title bg-light text-primary rounded-circle fs-4xl">
                            <i className="bi bi-search"></i>
                        </div>
                    </div>
                    <h5 className="mt-2">Sorry! No Result Found</h5>
                </div>
            </div>}

            {pagination ?
                <Row className='justify-content-between align-items-center mb-3' id="pagination-element" style={{ display: "flex" }}>
                    <div className="clo-auto">
                        <ul className="pagination pagination-rounded justify-content-end mb-2">
                            {currentPage <= 1 ? (
                                <PaginationItem>
                                    <PaginationLink href="#" previous className="page-item disabled pagination-prev"></PaginationLink>
                                </PaginationItem>
                            ) : (
                                <PaginationItem className={currentPage <= 1 ? "page-item disabled pagination-prev" : "page-item pagination-prev"}>
                                    <PaginationLink href="#" previous onClick={() => handleprevPage()}></PaginationLink>
                                </PaginationItem>
                            )}

                            <div className="pagination pagination-rounded justify-content-center">
                                {(pageNumbers || []).map((item: any, key: any) => (
                                    <PaginationItem className={currentPage === item ? "active " : ""} key={key}>
                                        <PaginationLink className="page" href="#" key={key} id={item} onClick={(e) => handleClick(e)}>
                                            {item}
                                        </PaginationLink>
                                    </PaginationItem>
                                ))}
                            </div>
                            <PaginationItem>
                                <PaginationLink href="#" next className={currentPage >= pageNumbers.length ? "page-item disabled pagination-next" : "page-item pagination-next"} onClick={() => handlenextPage()}></PaginationLink>
                            </PaginationItem>
                        </ul>
                    </div>
                </Row> : ''}
        </React.Fragment>
    );
}

export default Pagination;