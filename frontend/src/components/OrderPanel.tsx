import {
  Button,
  Col,
  Container,
  Pagination,
  PaginationItem,
  PaginationLink,
  Row,
  Table,
  UncontrolledAlert,
} from "reactstrap";
import { getOrderHistory } from "../http/get-order-history";
import { useState, useCallback, useMemo } from "react";
import { usePagination } from "../hooks/use-pagination";
import { PaginationOption } from "../interfaces/pagination-options.interface";
import { PaginationResults } from "../interfaces/pagination-results.interface";
import { OrderEntity } from "../interfaces/order.interface";
import { postChangeOrderStatus } from "../http/post-change-order-status";

export function OrderPanel() {
  const [orderCompletedAlert, setOrderCompletedAlert] = useState("");

  const [currentData, setCurrentData] =
    useState<PaginationResults<OrderEntity> | null>(null);
  const getPaginatedProductListing = useCallback(
    async (po?: PaginationOption, pu?: string) => {
      try {
        const result = await getOrderHistory(po, pu);
        return result;
      } finally {
        setRequesting(false);
      }
    },
    []
  );
  const [requesting, setRequesting] = useState(false);
  const [nextPage, previousPage, goToPage] = usePagination(
    6,
    getPaginatedProductListing
  );
  const [ready, setReady] = useState(false);
  useMemo(() => {
    if (!ready) {
      setRequesting(true);
      goToPage(1)
        .then(setCurrentData)
        .finally(() => setReady(true));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  const lastPage = !currentData
    ? 0
    : Math.floor(currentData.total / currentData.size) + 1;

  return (
    <Container>
      <Row className="mt-5">
        <Col xs="12">
          {orderCompletedAlert && (
            <UncontrolledAlert key={orderCompletedAlert} color="info">
              Order ID of{" "}
              <span style={{ fontWeight: "bold" }}>{orderCompletedAlert}</span>{" "}
              has been marked "Completed".
            </UncontrolledAlert>
          )}
          {!requesting && (
            <Table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Product ID</th>
                  <th>Product Name</th>
                  <th>Product Color</th>
                  <th>Order Status</th>
                  <th>Ordered At</th>
                  <th>Action</th>
                </tr>
              </thead>
              {ready && (
                <tbody>
                  {currentData?.results?.map((order) => (
                    <tr key={order.id}>
                      <th scope="row">{order.orderId}</th>
                      <td>{order.productStringId}</td>
                      <td>{order.nameDuringOrder}</td>
                      <td>{order.colorDuringOrder}</td>
                      <td>{order.status}</td>
                      <td>{new Date(order.createdAt).toLocaleString()}</td>
                      <td>
                        {order.status === "Open" && (
                          <Button
                            onClick={async () => {
                              try {
                                await postChangeOrderStatus(
                                  order.id,
                                  "Completed"
                                );
                                const newData = await goToPage(
                                  currentData.page
                                );
                                setOrderCompletedAlert(order.orderId);
                                setCurrentData(newData);
                              } finally {
                              }
                            }}
                          >
                            Set Completed
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              )}
            </Table>
          )}
        </Col>
      </Row>
      <Row>
        {!requesting && currentData && (
          <Col xs="auto" className="px-2 my-5" style={{ marginLeft: "auto" }}>
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
                    <PaginationItem disabled={currentData.nextPageUrl === null}>
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

                    <PaginationItem disabled={currentData.nextPageUrl === null}>
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
        )}
      </Row>
    </Container>
  );
}
