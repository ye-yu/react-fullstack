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
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { getSearchOptions } from "../http/get-search-option";
import { SearchOptions } from "../interfaces/search-options.interface";

export function ProductPanel() {
  const [searchOptions, setSearchOptions] = useState<SearchOptions[] | null>(
    null
  );

  const [searchInputs, setSearchInputs] = useState<Record<string, any>>({});

  const [dropdownOpenState, setDropdownOpenState] = useState<
    Record<string, boolean>
  >({});

  const searchAvailable = useMemo(() => {
    const searchAvailable = !!searchOptions;
    if (!searchAvailable) {
      getSearchOptions().then((newSearchOptions) => {
        setSearchOptions(newSearchOptions);
        for (const option of newSearchOptions) {
          setSearchInputs((previousValues) => ({
            ...previousValues,
            [option.name]: option.type === "text" ? "" : [],
          }));
          if (option.type === "dropdown") {
            setDropdownOpenState((previous) => ({
              ...previous,
              [option.name]: false,
            }));
          }
        }
      });
    }
    return searchAvailable;
  }, [searchOptions]);

  const dropdownIdToLabel = useMemo(() => {
    if (!searchOptions) return {} as Record<string, Record<number, string>>;
    const dropdownOptions = searchOptions.filter((e) => e.type === "dropdown");
    return dropdownOptions.reduce((a, b) => {
      a[b.name] = {};
      for (const { id, label } of b.options) {
        a[b.name][id] = label;
      }
      return a;
    }, {} as Record<string, Record<number, string>>);
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
                    switch (option.type) {
                      case "text":
                        return (
                          <FormGroup key={option.name}>
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
                                    onChange={(event) =>
                                      setSearchInputs((previous) => ({
                                        ...previous,
                                        [option.name]: event.target.value || "",
                                      }))
                                    }
                                  />
                                </Col>
                              </Row>
                            </Container>
                          </FormGroup>
                        );
                      case "dropdown":
                        return (
                          <FormGroup key={option.name}>
                            <Label for={option.name}>{option.label}</Label>
                            <Container className="px-1">
                              <Row className="gx-0">
                                <Col xs="12">
                                  <Dropdown
                                    isOpen={dropdownOpenState[option.name]}
                                    toggle={() =>
                                      setDropdownOpenState((previous) => ({
                                        ...previous,
                                        [option.name]: !previous[option.name],
                                      }))
                                    }
                                  >
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
                                          color: searchInputs[
                                            option.name
                                          ]?.find((e: any) => e)
                                            ? "black"
                                            : "inherit",
                                        }}
                                      >
                                        {dropdownIdToLabel[option.name]?.[
                                          searchInputs[option.name]?.find(
                                            (e: any) => e
                                          )
                                        ] ||
                                          option.placeholder ||
                                          "Select an Option"}
                                      </span>
                                    </DropdownToggle>
                                    <DropdownMenu>
                                      {option.options.map(({ id, label }) => (
                                        <DropdownItem
                                          onClick={() => {
                                            setSearchInputs((previous) => ({
                                              ...previous,
                                              [option.name]: [id],
                                            }));
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

                      default:
                        return null;
                    }
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
