import { Pagination } from "react-bootstrap";
import { Pagination as PaginationType } from "../types/pagination";

interface PaginationProps {
  pagination: PaginationType | null;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

const TablePagination = ({
  pagination,
  currentPage,
  setCurrentPage,
}: PaginationProps) => {
  if (!pagination) return null;

  if (pagination.totalPages === 1) {
    return null;
  }

  if (currentPage === 1) {
    return (
      <Pagination>
        <Pagination.First disabled />
        <Pagination.Prev disabled />
        <Pagination.Item>{currentPage}</Pagination.Item>
        <Pagination.Next onClick={() => setCurrentPage(currentPage + 1)} />
        <Pagination.Last
          onClick={() => {
            console.log("owen");
            setCurrentPage(pagination.totalPages);
          }}
        />
      </Pagination>
    );
  }
  if (currentPage === pagination.totalPages) {
    return (
      <Pagination>
        <Pagination.First onClick={() => setCurrentPage(1)} />
        <Pagination.Prev onClick={() => setCurrentPage(currentPage - 1)} />
        <Pagination.Item>{currentPage}</Pagination.Item>
        <Pagination.Next disabled />
        <Pagination.Last disabled />
      </Pagination>
    );
  }

  return (
    <Pagination>
      <Pagination.First onClick={() => setCurrentPage(1)} />
      <Pagination.Prev onClick={() => setCurrentPage(currentPage - 1)} />
      <Pagination.Item>{currentPage}</Pagination.Item>
      <Pagination.Next onClick={() => setCurrentPage(currentPage + 1)} />
      <Pagination.Last onClick={() => setCurrentPage(pagination.totalPages)} />
    </Pagination>
  );
};

export default TablePagination;
