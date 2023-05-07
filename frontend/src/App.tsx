import { useMemo, useState } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
} from "reactstrap";
import { SearchOptions } from "./interfaces/search-options.interface";
import { getSearchOptions } from "./http/get-search-option";

enum Panel {
  Product = "Product",
  Order = "Order",
}

export default function App() {
  const [panel, setPanel] = useState(Panel.Product);
  const [searchOptions, setSearchOptions] = useState<SearchOptions[] | null>(
    null
  );

  const searchAvailable = useMemo(() => {
    const searchAvailable = !!searchOptions;
    if (!searchAvailable) {
      getSearchOptions().then((newSearchOption) => {
        setSearchOptions(newSearchOption);
      });
    }
    return searchAvailable;
  }, [searchOptions]);

  return (
    <Container className="mt-3" fluid>
      <Row style={{ justifyContent: "center" }}>
        <Col xs="auto">
          <Button
            className="mx-3"
            color={panel === Panel.Product ? "primary" : undefined}
            onClick={() => setPanel(Panel.Product)}
          >
            Product Listing
          </Button>

          <Button
            className="mx-3"
            color={panel === Panel.Order ? "primary" : undefined}
            onClick={() => setPanel(Panel.Order)}
          >
            Order Listing
          </Button>
        </Col>
      </Row>
      <Row className="mt-3">
        {/* search panel */}
        <Col xs="3">
          <Container>
            <Row>
              <Col xs="12">
                <div
                  style={{
                    textAlign: "center",
                    fontWeight: "bold",
                    fontSize: "1.5rem",
                  }}
                >
                  Search Filter
                </div>
              </Col>
              <Col xs="12" className="mt-3">
                <Form>
                  {searchAvailable &&
                    searchOptions?.map((option) => {
                      return (
                        <FormGroup key={option.name}>
                          <Label for={option.name}>{option.label}</Label>
                          <Input
                            id={option.name}
                            name={option.name}
                            placeholder={option.placeholder}
                            type="text"
                          />
                        </FormGroup>
                      );
                    })}
                  <Button
                    className="w-100 mt-3"
                    color="primary"
                    onClick={(e) => e.preventDefault()}
                  >
                    Search
                  </Button>
                </Form>
              </Col>
            </Row>
          </Container>
        </Col>
        <Col xs="9">
          <Container fluid></Container>
        </Col>
      </Row>
    </Container>
  );
}
