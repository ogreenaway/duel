import { Form } from "react-bootstrap";

interface LimitSelectorProps {
  currentLimit: number;
  setCurrentLimit: (limit: number) => void;
  setCurrentPage: (page: number) => void;
}

const LimitSelector = ({
  currentLimit,
  setCurrentLimit,
  setCurrentPage,
}: LimitSelectorProps) => {
  return (
    <div style={{ minWidth: "150px" }}>
      <Form.Select
        aria-label="Limit select"
        value={currentLimit}
        onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
          setCurrentLimit(Number(event.target.value));
          // Reset the page to 1 when the limit is changed because otherwise it might not exist anymore
          setCurrentPage(1);
        }}
      >
        <option value="5">Limit: 5</option>
        <option value="10">Limit: 10</option>
        <option value="20">Limit: 20</option>
        <option value="50">Limit: 50</option>
        <option value="100">Limit: 100</option>
        <option value="200">Limit: 200</option>
        <option value="500">Limit: 500</option>
        <option value="1000">Limit: 1000</option>
        <option value="2000">Limit: 2000</option>
        <option value="5000">Limit: 5000</option>
        <option value="10000">Limit: 10000</option>
      </Form.Select>
    </div>
  );
};

export default LimitSelector;
