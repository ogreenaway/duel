import { Container } from "react-bootstrap";
import Correlation from "./correlation/Correlation";
import NavBar from "../../components/NavBar";
import ScatterPlot from "./scatter_plot/ScatterPlot";

const StatisticsScreen = () => {
  return (
    <>
      <NavBar />
      <Container className="mt-4">
        <h1 className="text-center m-4 text-decoration-underline">
          Statistics
        </h1>
        <h2>Correlation coefficients for the whole dataset</h2>
        <Correlation />
        <h2 className="mt-4 mb-4">Scatter plot</h2>
        <ScatterPlot />
      </Container>
    </>
  );
};

export default StatisticsScreen;
