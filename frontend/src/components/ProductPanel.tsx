import { useState, useMemo } from "react";
import {
  Row,
  Col,
  Container,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
} from "reactstrap";
import { getSearchOptions } from "../http/get-search-option";
import { SearchOptions } from "../interfaces/search-options.interface";

export function ProductPanel() {
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
  );
}
