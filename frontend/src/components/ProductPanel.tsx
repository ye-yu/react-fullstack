import {
  Row,
  Col,
  Container,
  Card,
  Button,
  CardBody,
  CardSubtitle,
  CardText,
  CardTitle,
  Pagination,
  PaginationItem,
  PaginationLink,
  UncontrolledAlert,
} from "reactstrap";
import { ProductSearchPanel } from "./ProductSearchPanel";
import { usePagination } from "../hooks/use-pagination";
import { postSearchProducts } from "../http/post-search-products";
import { useCallback, useEffect, useState } from "react";
import { PaginationResults } from "../interfaces/pagination-results.interface";
import { ProductEntity } from "../interfaces/product.interface";
import { PaginationOption } from "../interfaces/pagination-options.interface";
import { postPlaceOrder } from "../http/post-place-order";

export function ProductPanel() {
  const [orderPlacedAlert, setOrderPlacedAlert] = useState("");
  const [orderFailedAlert, setOrderFailedAlert] = useState("");
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
    8,
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

  const noProductsAvailable = !requesting && !currentData;
  const emptyProducts =
    !requesting && currentData && currentData.results.length === 0;
  const productIsAvailable =
    !requesting && currentData && currentData.results.length !== 0;

  const lastPage = !currentData
    ? 0
    : Math.floor(currentData.total / currentData.size) + 1;
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
          {orderPlacedAlert && (
            <UncontrolledAlert key={orderPlacedAlert} color="info">
              Order of{" "}
              <span style={{ fontWeight: "bold" }}>{orderPlacedAlert}</span> has
              been placed.
            </UncontrolledAlert>
          )}
          {orderFailedAlert && (
            <UncontrolledAlert key={orderFailedAlert} color="error">
              Failed to place order for{" "}
              <span style={{ fontWeight: "bold" }}>{orderFailedAlert}</span>!
            </UncontrolledAlert>
          )}
          {requesting && (
            <Row>
              <Col style={{ textAlign: "center" }}>Fetching...</Col>
            </Row>
          )}
          {noProductsAvailable && (
            <Row>
              <Col style={{ textAlign: "center" }}>No Products Available</Col>
            </Row>
          )}
          {emptyProducts && (
            <Row>
              <Col style={{ textAlign: "center" }}>No Products Available</Col>
            </Row>
          )}
          {productIsAvailable && (
            <Row className="gx-5 gy-5">
              {currentData.results.map((value) => (
                <Col key={value.id} xs="3">
                  <Card>
                    <img src={value.photos.find((e) => e)} alt={value.name} />
                    <CardBody>
                      <CardTitle tag="h5">{value.name}</CardTitle>
                      <CardSubtitle className="mb-2 text-muted" tag="h6">
                        {value.brand?.name}
                      </CardSubtitle>
                      <CardText>
                        <span style={{ fontSize: "0.8rem", display: "block" }}>
                          ({value.category.name})
                        </span>
                        <span style={{ fontSize: "0.8rem" }}>
                          {value.colors.map((e) => e.name).join(", ")}
                        </span>
                      </CardText>

                      <CardText></CardText>
                      <Button
                        size="sm"
                        onClick={async () => {
                          try {
                            setRequesting(true);
                            const success = await postPlaceOrder(value.id);
                            if (success) {
                              setOrderPlacedAlert(value.name);
                              const newData = await goToPage(1);
                              setCurrentData(newData);
                            } else {
                              setOrderFailedAlert(value.name);
                            }
                          } finally {
                            setRequesting(false);
                          }
                        }}
                      >
                        Place Order
                      </Button>
                    </CardBody>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
          {productIsAvailable && (
            <Row>
              <Col
                xs="auto"
                className="px-2 my-5"
                style={{ marginLeft: "auto" }}
              >
                <Container>
                  <Row>
                    <Col xs="auto">
                      <Pagination>
                        <PaginationItem disabled={currentData.page === 1}>
                          <PaginationLink
                            first
                            onClick={async () => {
                              const e = await goToPage(1);
                              if (e !== null) {
                                setCurrentData(e);
                              }
                            }}
                          />
                        </PaginationItem>
                        <PaginationItem
                          disabled={currentData.previousPageUrl === null}
                        >
                          <PaginationLink
                            previous
                            onClick={async () => {
                              const e = await previousPage();
                              if (e !== null) {
                                setCurrentData(e);
                              }
                            }}
                          />
                        </PaginationItem>
                        {Array.from({ length: 5 }).map((_, i) => {
                          const pageNumber = currentData.page + i - 2;
                          if (pageNumber < 1) {
                            return null;
                          }
                          if (
                            (pageNumber - 1) * currentData.size >
                            currentData.total
                          ) {
                            return null;
                          }
                          return (
                            <PaginationItem
                              key={pageNumber}
                              onClick={async () => {
                                const e = await goToPage(pageNumber);
                                if (e !== null) {
                                  setCurrentData(e);
                                }
                              }}
                            >
                              <PaginationLink
                                style={{
                                  fontWeight: i === 2 ? "bold" : "normal",
                                }}
                              >
                                {pageNumber}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        })}
                        <PaginationItem
                          disabled={currentData.nextPageUrl === null}
                        >
                          <PaginationLink
                            next
                            onClick={async () => {
                              const e = await nextPage();
                              if (e !== null) {
                                setCurrentData(e);
                              }
                            }}
                          />
                        </PaginationItem>

                        <PaginationItem
                          disabled={currentData.nextPageUrl === null}
                        >
                          <PaginationLink
                            last
                            onClick={async () => {
                              const e = await goToPage(lastPage);
                              if (e !== null) {
                                setCurrentData(e);
                              }
                            }}
                          />
                        </PaginationItem>
                      </Pagination>
                    </Col>
                  </Row>
                </Container>
              </Col>
            </Row>
          )}
        </Container>
      </Col>
    </Row>
  );
}
