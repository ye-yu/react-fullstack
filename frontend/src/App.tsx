import { useState } from "react";
import { Button, ButtonGroup, Col, Container, Row } from "reactstrap";
import { ProductPanel } from "./components/ProductPanel";

enum Panel {
  Product = "Product",
  Order = "Order",
}

export default function App() {
  const [panel, setPanel] = useState(Panel.Product);

  return (
    <Container className="mt-3" fluid>
      <Row style={{ justifyContent: "center" }}>
        <Col xs="auto">
          <ButtonGroup>
            <Button
              outline={panel !== Panel.Product}
              color={panel === Panel.Product ? "primary" : undefined}
              onClick={() => setPanel(Panel.Product)}
            >
              Product Listing
            </Button>

            <Button
              outline={panel !== Panel.Order}
              color={panel === Panel.Order ? "primary" : undefined}
              onClick={() => setPanel(Panel.Order)}
            >
              Order Listing
            </Button>
          </ButtonGroup>
        </Col>
      </Row>
      {panel === Panel.Product && <ProductPanel />}
    </Container>
  );
}
