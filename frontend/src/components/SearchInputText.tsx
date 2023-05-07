import { FormGroup, Label, Container, Row, Col, Input } from "reactstrap";
import { SearchOptions } from "../interfaces/search-options.interface";

export function SearchInputText({
  option,
  onChange,
}: {
  option: SearchOptions;
  onChange: (change: string) => void;
}) {
  return (
    <FormGroup>
      <Label for={option.name}>{option.label}</Label>
      <Container className="px-1">
        <Row className="gx-0">
          <Col xs="12">
            <Input
              style={{ borderColor: "#6c757d" }}
              id={option.name}
              name={option.name}
              placeholder={option.placeholder}
              type="text"
              onChange={(event) => onChange(event.target.value)}
            />
          </Col>
        </Row>
      </Container>
    </FormGroup>
  );
}
