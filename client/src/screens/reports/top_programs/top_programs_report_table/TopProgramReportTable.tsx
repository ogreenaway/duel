import { Alert, Spinner, Table } from "react-bootstrap";
import { useEffect, useState } from "react";

import Currency from "../../../../components/Currency";
import LimitSelector from "../../../../components/LimitSelector";
import { Link } from "react-router-dom";
import { Pagination } from "../../../../types/pagination";
import TablePagination from "../../../../components/Pagination";
import { TopProgram } from "../../../../types/TopProgramReport";

interface GetTopProgramsReportProps {
  currentPage: number;
  currentLimit: number;
  setReportData: (data: TopProgram[]) => void;
  setPagination: (pagination: Pagination) => void;
  setError: (error: Error) => void;
  setLoading: (loading: boolean) => void;
}

const getTopProgramsReport = async ({
  currentPage,
  currentLimit,
  setReportData,
  setPagination,
  setError,
  setLoading,
}: GetTopProgramsReportProps) => {
  setLoading(true);
  try {
    const params = new URLSearchParams({
      page: currentPage.toString(),
      limit: currentLimit.toString(),
    });
    const response = await fetch(
      `http://localhost:5000/reports/programs/top?${params.toString()}`
    );
    const data = await response.json();
    setReportData(data.data);
    setPagination(data.pagination);
  } catch (error) {
    setError(error as Error);
  } finally {
    setLoading(false);
  }
};

const TopProgramReportTable = () => {
  const [reportData, setReportData] = useState<TopProgram[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentLimit, setCurrentLimit] = useState(10);

  useEffect(() => {
    getTopProgramsReport({
      currentPage,
      currentLimit,
      setReportData,
      setPagination,
      setError,
      setLoading,
    });
  }, [currentPage, currentLimit]);

  if (error) {
    return <Alert variant={"danger"}>{error.message}</Alert>;
  }

  if (loading) {
    return (
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    );
  }

  return (
    <>
      <Table responsive striped>
        <thead>
          <tr>
            <th>Program ID</th>
            <th>Legacy Program ID</th>
            <th>Brand</th>
            <th>Total Sales Attributed</th>
          </tr>
        </thead>
        <tbody>
          {reportData.map((program) => (
            <tr key={program._id}>
              <td>
                <Link to={`/programs/${program._id}`}>{program._id}</Link>
              </td>
              <td>{program.legacy_program_id}</td>
              <td>{program.brand}</td>
              <td>
                <Currency value={program.total_sales_attributed} />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="d-flex justify-content-between align-items-center mt-3">
        <TablePagination
          pagination={pagination}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
        <LimitSelector
          currentLimit={currentLimit}
          setCurrentLimit={setCurrentLimit}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </>
  );
};

export default TopProgramReportTable;
