import { Card, Row, Col, Form, Button } from "react-bootstrap";

export default function checkoutPopItem({
    item,
  qty,
  add,
  subtract,
  handleQtyChange,
  removeItem
}) {
 
  const qtyInputStyle = {
    width: 40,
    padding: 0,
    textAlign: "center",
    height: "1.8rem",
    fontWeight: 600,
    fontSize: 14,
  };

  const cardStyle = {
    border: "none",
    marginBottom: 16,
  };
  const imgStyle = {
    width: 80,
    height: 80,
    borderRadius: 8,
    objectFit: "contain",
  };

  const removeButtonStyle = {
    padding: 0,
    border: "none",
    background: "transparent",
    fontSize: 20,
    lineHeight: 1,
  };

  const qtyWrapperStyle = {
    display: "flex",
    alignItems: "center",
    gap: 8,
    borderRadius: 999,
    border: "1px solid #ddd",
    padding: "4px 10px",
  };

  const qtyButtonStyle = {
    padding: "2px 8px",
    borderRadius: 999,
    border: "none",
    backgroundColor: "transparent",
    fontSize: 18,
  };

  

  return (
    <Card style={cardStyle}>
      <Row style={{ alignItems: "center" }}>
        <Col xs="auto">
          <img src={item.image}    alt={item.description}
             style={imgStyle} />
        </Col>

        <Col>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <div>
              <div style={{ fontWeight: 600 }}>{item.description}</div>
             
            </div>
            <button style={removeButtonStyle} aria-label="Remove item" onClick={removeItem}>
              ×
            </button>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 8,
            }}
          >
            <div style={{ fontWeight: 600 }}>{item.price}</div>

            <div style={qtyWrapperStyle}>
              <button style={qtyButtonStyle} onClick={subtract}>
                −
              </button>
              <Form.Control
                type="text"
                inputMode="numeric"
                value={qty}
                onChange={handleQtyChange}
                style={qtyInputStyle}
                placeholder="0"
                aria-label="Quantity to add"

              />
              <button style={qtyButtonStyle} onClick={add}>
                +
              </button>
            </div>
          </div>
        </Col>
      </Row>
    </Card>
  );
}
