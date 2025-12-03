import { Card, Row } from "react-bootstrap";
import { useEffect, useState } from "react";

import LoadingSpinner from "../../../components/LoadingSpinner";

interface CorrelationData {
  reachCorrelationCoefficient: number;
  sharesCorrelationCoefficient: number;
  likesCorrelationCoefficient: number;
  commentsCorrelationCoefficient: number;
}

const Correlation = () => {
  const [data, setData] = useState<CorrelationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCorrelationData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "http://localhost:5000/reports/correlation-coefficients"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch correlation coefficients");
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchCorrelationData();
  }, []);

  const formatNumber = (num: number): string => {
    return num.toFixed(3);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="text-danger">Error: {error.message}</div>;
  }

  if (!data) {
    return <div>No data available</div>;
  }

  return (
    <Row className="g-4">
      <p>
        Correlation coefficients between engagement metrics and the total sales
        attributed to the program
      </p>
      <div className="col-md-3">
        <Card>
          <Card.Header>
            <h5 className="mb-0">Reach Correlation</h5>
          </Card.Header>
          <Card.Body>
            <div className="display-4">
              {formatNumber(data.reachCorrelationCoefficient)}
            </div>
          </Card.Body>
        </Card>
      </div>
      <div className="col-md-3">
        <Card>
          <Card.Header>
            <h5 className="mb-0">Shares Correlation</h5>
          </Card.Header>
          <Card.Body>
            <div className="display-4">
              {formatNumber(data.sharesCorrelationCoefficient)}
            </div>
          </Card.Body>
        </Card>
      </div>
      <div className="col-md-3">
        <Card>
          <Card.Header>
            <h5 className="mb-0">Likes Correlation</h5>
          </Card.Header>
          <Card.Body>
            <div className="display-4">
              {formatNumber(data.likesCorrelationCoefficient)}
            </div>
          </Card.Body>
        </Card>
      </div>
      <div className="col-md-3">
        <Card>
          <Card.Header>
            <h5 className="mb-0">Comments Correlation</h5>
          </Card.Header>
          <Card.Body>
            <div className="display-4">
              {formatNumber(data.commentsCorrelationCoefficient)}
            </div>
          </Card.Body>
        </Card>
      </div>
    </Row>
  );
};

export default Correlation;
