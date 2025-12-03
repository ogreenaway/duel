import { Alert, Spinner, Table } from "react-bootstrap";
import { useEffect, useState } from "react";

import Currency from "../../../components/Currency";
import LimitSelector from "../../../components/LimitSelector";
import { Pagination } from "../../../types/pagination";
import { Program } from "../../../types/ProgramModel";
import TablePagination from "../../../components/Pagination";

interface GetProgramsProps {
  currentPage: number;
  currentLimit: number;
  setPrograms: (programs: Program[]) => void;
  setPagination: (pagination: Pagination) => void;
  setError: (error: Error) => void;
  setLoading: (loading: boolean) => void;
}

const getPrograms = async ({
  currentPage,
  currentLimit,
  setPrograms,
  setPagination,
  setError,
  setLoading,
}: GetProgramsProps) => {
  setLoading(true);
  try {
    const response = await fetch(
      `http://localhost:5000/programs?page=${currentPage}&limit=${currentLimit}`
    );
    const data = await response.json();
    setPrograms(data.data);
    setPagination(data.pagination);
  } catch (error) {
    setError(error as Error);
  } finally {
    setLoading(false);
  }
};

const ProgramsTable = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentLimit, setCurrentLimit] = useState(10);

  useEffect(() => {
    getPrograms({
      currentPage,
      currentLimit,
      setPrograms,
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
          {programs.map((program) => (
            <tr key={program._id}>
              <td>{program._id}</td>
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

export default ProgramsTable;
