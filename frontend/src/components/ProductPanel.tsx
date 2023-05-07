import { Row, Col, Container, Card } from "reactstrap";
import { ProductSearchPanel } from "./ProductSearchPanel";
import { usePagination } from "../hooks/use-pagination";
import { postSearchProducts } from "../http/post-search-products";
import { useCallback, useEffect, useState } from "react";
import { PaginationResults } from "../interfaces/pagination-results.interface";
import { ProductEntity } from "../interfaces/product.interface";
import { PaginationOption } from "../interfaces/pagination-options.interface";

export function ProductPanel() {
  const [searchInputs, setSearchInputs] = useState<Record<string, any>>({});
  const [currentData, setCurrentData] =
    useState<PaginationResults<ProductEntity> | null>(null);
  const getPaginatedProductListing = useCallback(
    async (po?: PaginationOption, pu?: string) => {
      try {
        const result = await postSearchProducts(searchInputs, po, pu);
        return result;
      } finally {
        setRequesting(false);
      }
    },
    [searchInputs]
  );
  const [requesting, setRequesting] = useState(false);
  const [nextPage, previousPage, goToPage] = usePagination(
    20,
    getPaginatedProductListing
  );

  useEffect(() => {
    if (requesting) {
      return;
    }
    setRequesting(true);
    goToPage(1)
      .then(setCurrentData)
      .finally(() => {
        setRequesting(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInputs]);

  return (
    <Row className="mt-3">
      {/* search panel */}
      <Col xs="3">
        <ProductSearchPanel
          onSearch={(payload) => {
            setSearchInputs(payload);
          }}
        />
      </Col>
      <Col xs="9">
        <Container className="mt-5" fluid>
          {requesting && (
            <Row>
              <Col style={{ textAlign: "center" }}>Fetching...</Col>
            </Row>
          )}
          {!requesting && !currentData && (
            <Row>
              <Col style={{ textAlign: "center" }}>No Products Available</Col>
            </Row>
          )}
          {!requesting && currentData && currentData.results.length === 0 && (
            <Row>
              <Col style={{ textAlign: "center" }}>No Products Available</Col>
            </Row>
          )}
          {!requesting && currentData && currentData.results.length && (
            <Row className="gx-5 gy-5">
              {currentData.results.map((value) => (
                <Col key={value.id} xs="3">
                  <Card style={{ borderRadius: "50px" }}>
                    <img src={value.photos.find((e) => e)} alt={value.name} />
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Container>
      </Col>
    </Row>
  );
}
