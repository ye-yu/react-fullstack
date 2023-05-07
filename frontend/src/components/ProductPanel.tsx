import { Row, Col, Container } from "reactstrap";
import { ProductSearchPanel } from "./ProductSearchPanel";

export function ProductPanel() {
  return (
    <Row className="mt-3">
      {/* search panel */}
      <Col xs="3">
        <ProductSearchPanel
          onSearch={(searchInputs) => console.log({ searchInputs })}
        />
      </Col>
      <Col xs="9">
        <Container fluid></Container>
      </Col>
    </Row>
  );
}
