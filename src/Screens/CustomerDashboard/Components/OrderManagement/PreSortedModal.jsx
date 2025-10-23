import { Modal, Button, Row, Col, Card, Table } from "react-bootstrap";
import { BiEditAlt } from "react-icons/bi";
import { FaCheck, FaTimes } from "react-icons/fa";
import Swal from "sweetalert2";

const PresortedModal = ({
  showModal,
  setShowModal,
  selectedOrder,
  editedOrder,
  setEditedOrder,
  prescriptionItems,
  setPrescriptionItems,
  handleItemChange,
  handleSaveChanges,
  editingField,
  setEditingField,
  editingRowIndex,
  setEditingRowIndex,
  originalPrescriptionItems,
  isLoadingOrder,
  editableFields,
  handleRenewOrder,
}) => {
  const isDelivered =
    selectedOrder?.order_info?.presorted_status?.toLowerCase() ===
      "delivered" ||
    selectedOrder?.order_info?.nonsorted_status?.toLowerCase() === "delivered";

  console.log("This is the selected order", selectedOrder);

  return (
    <Modal
      show={showModal}
      onHide={() => setShowModal(false)}
      size="xl"
      centered
    >
      <Modal.Header closeButton>
        <div className="d-flex w-100 align-items-center justify-content-between">
          <Modal.Title className="mb-0">Order Details</Modal.Title>

          {isDelivered && (
            <Button
              type="button"
              variant="primary"
              className="ms-auto"
              onClick={() =>
                handleRenewOrder(selectedOrder?.order_info?.order_id)
              }
            >
              Re Order
            </Button>
          )}
        </div>
      </Modal.Header>

      <Modal.Body>
        {isLoadingOrder ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary"></div>
          </div>
        ) : (
          <>
            {selectedOrder?.images?.length > 0 && (
              <div className="d-flex flex-wrap gap-3 mb-4">
                {selectedOrder.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img.filePath}
                    alt={`Prescription ${idx + 1}`}
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      Swal.fire({
                        html: `<img src="${img.filePath}" style="max-width: 100%; height: auto; border-radius: 10px;">`,
                        showConfirmButton: false,
                        background: "transparent",
                        backdrop: true,
                      });
                    }}
                  />
                ))}
              </div>
            )}
            {/* Editable Fields */}

            <Row className="g-3 mt-3">
              {editableFields?.map((field) => (
                <Col md={6} key={field}>
                  <Card className="p-3">
                    <label className="fw-bold">{field}</label>
                    <div className="d-flex align-items-center gap-2">
                      {editingField === field ? (
                        <input
                          type="text"
                          className="form-control"
                          value={editedOrder[field] || ""}
                          onChange={(e) =>
                            setEditedOrder({
                              ...editedOrder,
                              [field]: e.target.value,
                            })
                          }
                        />
                      ) : (
                        <>
                          <span>{editedOrder[field] || "-"}</span>
                          {isDelivered && (
                            <Button
                              variant="link"
                              size="sm"
                              onClick={() => setEditingField(field)}
                            >
                              <BiEditAlt />
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>

            {/* Prescription Items */}
            <h5 className="mt-4">Prescription Items</h5>
            <Table bordered>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Price PU</th>
                  <th>Total</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {prescriptionItems?.map((item, idx) => (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td>{item.product_name}</td>
                    <td>
                      {editingRowIndex === idx ? (
                        <input
                          type="number"
                          value={item.quantity}
                          className="form-control"
                          onChange={(e) =>
                            handleItemChange(idx, "quantity", e.target.value)
                          }
                        />
                      ) : (
                        item.quantity
                      )}
                    </td>
                    <td>{item.price_pu}</td>
                    <td>{item.total_price}</td>
                    <td>
                      {editingRowIndex === idx ? (
                        <>
                          <Button
                            size="sm"
                            variant="success"
                            onClick={() => setEditingRowIndex(null)}
                          >
                            <FaCheck />
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => {
                              setPrescriptionItems(originalPrescriptionItems);
                              setEditingRowIndex(null);
                            }}
                            className="ms-2"
                          >
                            <FaTimes />
                          </Button>
                        </>
                      ) : (
                        isDelivered && (
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => setEditingRowIndex(idx)}
                          >
                            <BiEditAlt />
                          </Button>
                        )
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowModal(false)}>
          Close
        </Button>
        {isDelivered && (
          <Button variant="success" onClick={handleSaveChanges}>
            Save Changes
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default PresortedModal;
