import { useState, useMemo } from "react";
import { Container, Row, Col, Form, Button } from "reactstrap";
import { getSearchOptions } from "../http/get-search-option";
import { SearchOptions } from "../interfaces/search-options.interface";
import { SearchInputText } from "./SearchInputText";
import { SearchInputDropdown } from "./SearchInputDropdown";

export function ProductSearchPanel({
  onSearch,
}: {
  onSearch: (searchInputs: Record<string, any>) => void;
}) {
  const [searchOptions, setSearchOptions] = useState<SearchOptions[] | null>(
    null
  );

  const [searchInputs, setSearchInputs] = useState<Record<string, any>>({});

  const searchAvailable = useMemo(() => {
    const searchAvailable = !!searchOptions;
    if (!searchAvailable) {
      getSearchOptions().then((newSearchOptions) => {
        setSearchOptions(newSearchOptions);
        for (const option of newSearchOptions) {
          setSearchInputs((previousValues) => ({
            ...previousValues,
            [option.name]: null,
          }));
        }
      });
    }
    return searchAvailable;
  }, [searchOptions]);

  return (
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
                      <SearchInputText
                        key={option.name}
                        option={option}
                        onChange={(value) =>
                          setSearchInputs((previous) => ({
                            ...previous,
                            [option.name]: value || null,
                          }))
                        }
                      />
                    );
                  case "dropdown":
                    return (
                      <SearchInputDropdown
                        key={option.name}
                        option={option}
                        onChange={(value, unselected) => {
                          setSearchInputs((previous) => ({
                            ...previous,
                            [option.name]: unselected ? null : [value],
                          }));
                        }}
                      />
                    );

                  default:
                    return null;
                }
              })}
            <Button
              className="w-100 mt-3"
              color="primary"
              onClick={(e) => {
                e.preventDefault();
                onSearch(searchInputs);
              }}
            >
              Search
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
