import { Alert, Form, Spinner, Table } from "react-bootstrap";
import {
  Platform,
  SortBy,
  UserReportStats,
} from "../../../../types/TopUsersReport";
import { useEffect, useState } from "react";

import LimitSelector from "../../../../components/LimitSelector";
import { Link } from "react-router-dom";
import { Pagination } from "../../../../types/pagination";
import TablePagination from "../../../../components/Pagination";

interface GetTopUsersReportProps {
  currentPage: number;
  currentLimit: number;
  sortBy: SortBy;
  platform?: Platform;
  setReportData: (data: UserReportStats[]) => void;
  setPagination: (pagination: Pagination) => void;
  setError: (error: Error) => void;
  setLoading: (loading: boolean) => void;
}

const getTopUsersReport = async ({
  currentPage,
  currentLimit,
  sortBy,
  platform,
  setReportData,
  setPagination,
  setError,
  setLoading,
}: GetTopUsersReportProps) => {
  setLoading(true);
  try {
    const params = new URLSearchParams({
      page: currentPage.toString(),
      limit: currentLimit.toString(),
      sortBy: sortBy,
    });
    if (platform) {
      params.append("platform", platform);
    }
    const response = await fetch(
      `http://localhost:5000/reports/users/top?${params.toString()}`
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

const TopUsersReportTable = () => {
  const [reportData, setReportData] = useState<UserReportStats[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentLimit, setCurrentLimit] = useState(10);
  const [sortBy, setSortBy] = useState<SortBy>("likes");
  const [platform, setPlatform] = useState<Platform | undefined>(undefined);

  useEffect(() => {
    getTopUsersReport({
      currentPage,
      currentLimit,
      sortBy,
      platform,
      setReportData,
      setPagination,
      setError,
      setLoading,
    });
  }, [currentPage, currentLimit, sortBy, platform]);

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
            <th>User ID</th>
            <th>Name</th>
            <th>Total Likes</th>
            <th>Total Comments</th>
            <th>Total Shares</th>
            <th>Total Reach</th>
          </tr>
        </thead>
        <tbody>
          {reportData.map((stats) => (
            <tr key={stats.user._id}>
              <td>
                <Link to={`/users/${stats.user._id}`}>{stats.user._id}</Link>
              </td>
              <td>{stats.user.name}</td>
              <td>{stats.totalLikes}</td>
              <td>{stats.totalComments}</td>
              <td>{stats.totalShares}</td>
              <td>{stats.totalReach}</td>
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
        <Form.Select
          value={sortBy}
          onChange={(e) => {
            setSortBy(e.target.value as SortBy);
            setCurrentPage(1);
          }}
          className="w-auto"
        >
          <option value="likes">Sort by Likes</option>
          <option value="comments">Sort by Comments</option>
          <option value="shares">Sort by Shares</option>
          <option value="reach">Sort by Reach</option>
        </Form.Select>
        <Form.Select
          value={platform || "all"}
          onChange={(e) => {
            const value = e.target.value;
            setPlatform(value === "all" ? undefined : (value as Platform));
            setCurrentPage(1);
          }}
          className="w-auto"
        >
          <option value="all">From all platforms</option>
          <option value="TikTok">Only from TikTok</option>
          <option value="Instagram">Only from Instagram</option>
          <option value="Facebook">Only from Facebook</option>
        </Form.Select>
        <LimitSelector
          currentLimit={currentLimit}
          setCurrentLimit={setCurrentLimit}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </>
  );
};

export default TopUsersReportTable;
