import {
  FormGroup,
  Label,
  Container,
  Row,
  Col,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { SearchOptions } from "../interfaces/search-options.interface";
import { useMemo, useState } from "react";

export function SearchInputDropdown({
  option,
  onChange,
}: {
  option: SearchOptions;
  onChange: (change: number, unselected: boolean) => void;
}) {
  const [isOpen, setOpen] = useState(false);
  const [currentSelection, setCurrentSelection] = useState<number | null>(null);
  const unselected = useMemo(() => {
    return currentSelection === null;
  }, [currentSelection]);

  const dropdownIdToLabel = useMemo(() => {
    return option.options.reduce((a, b) => {
      a[b.id] = b.label;
      return a;
    }, {} as Record<number, string>);
  }, [option.options]);

  const currentSelectionLabel = useMemo(() => {
    if (currentSelection === null) {
      return null;
    }
    return dropdownIdToLabel[currentSelection] ?? null;
  }, [dropdownIdToLabel, currentSelection]);
  return (
    <FormGroup key={option.name}>
      <Label for={option.name}>{option.label}</Label>
      <Container className="px-1">
        <Row className="gx-0">
          <Col xs="12">
            <Dropdown isOpen={isOpen} toggle={() => setOpen(!isOpen)}>
              <DropdownToggle
                className="w-100"
                style={{ textAlign: "left" }}
                caret
                outline
              >
                <span
                  className="d-inline-block"
                  style={{
                    width: "95%",
                    color: unselected ? "inherit" : "black",
                  }}
                >
                  {currentSelectionLabel ||
                    option.placeholder ||
                    "Select an Option"}
                </span>
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem
                  style={{ color: "#adb5bd" }}
                  onClick={() => {
                    setCurrentSelection(null);
                    onChange(0, true);
                  }}
                >
                  (Empty)
                </DropdownItem>
                {option.options.map(({ id, label }) => (
                  <DropdownItem
                    onClick={() => {
                      setCurrentSelection(id);
                      onChange(id, false);
                    }}
                    key={id}
                  >
                    {label}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </Col>
        </Row>
      </Container>
    </FormGroup>
  );
}
