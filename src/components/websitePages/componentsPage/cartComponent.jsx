import React from "react";
import { Card, Button, Table, Form, Row } from "react-bootstrap";

export default function CartComponent({
  item,
  cardStyle,
  qty,
  handleQtyChange,
}) {
  const [inputQty, setInputQty] = React.useState("");
  const [feedback, setFeedback] = React.useState("");

  React.useEffect(() => {
    if (!feedback) return;
    const timer = setTimeout(() => setFeedback(""), 3000);
    return () => clearTimeout(timer);
  }, [feedback]);

  const cals = item?.nutrition.calories_kcal ?? "-";
  const prot = item?.nutrition.protein_g ?? "-";
  const fat = item?.nutrition.fat_g ?? "-";

  const handleLocalChange = (e) => {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    setInputQty(raw);
  };
  const incrementLocal = () => {
    const current = inputQty === "" ? 0 : Number(inputQty);
    setInputQty(String(current + 1));
  };

  const decrementLocal = () => {
    const current = inputQty === "" ? 0 : Number(inputQty);
    const next = Math.max(0, current - 1);
    setInputQty(next === 0 ? "" : String(next));
  };

  const handleAddClick = () => {
    const currentCartQty = qty ?? 0; // real cart total for this item

    let amount = inputQty === "" ? 1 : Number(inputQty);
    if (!Number.isFinite(amount) || amount <= 0) {
      amount = 1;
    }

    const newTotal = currentCartQty + amount;

    handleQtyChange({ target: { value: String(newTotal) } });

    const name = item?.description || "item";
    setFeedback(`Added ${amount} ${name} to cart.`);

    setInputQty("0");
  };

  const qtyInputStyle = {
    width: "clamp(2.2rem, 6vw, 2.8rem)",
    padding: 0,
    textAlign: "center",
    height: "clamp(1.6rem, 4vw, 2rem)",
    fontWeight: 600,
    fontSize: "clamp(0.8rem, 2vw, 1rem)",
  };

  const qtyWrapperStyle = {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
    borderRadius: 999,
    border: "1px solid #ddd",
    padding: "4px 10px",
  };

  const qtyButtonStyle = {
    padding: "0.1rem 0.4rem",
    borderRadius: 999,
    border: "none",
    backgroundColor: "transparent",
    fontSize: "clamp(1rem, 2.6vw, 1.4rem)",
    lineHeight: 1,
  };

  const priceStyle = {
    fontSize: 20,
    marginBottom: "0.6rem",
  };

  const cardImage = {
    padding: 20,
    width: "100%",
    height: 180,
    objectFit: "contain",
    display: "block",
  };

  const buttonDesign = {
    borderRadius: 999,
    fontWeight: 600,
    marginBottom: 10,
    marginRight: 10,
    padding: "0.35rem 1.1rem",
    fontSize: "clamp(0.85rem, 2vw, 1rem)",
  };

  const tableStyle = {
    width: "94%",
    margin: 10,
    fontSize: "clamp(0.2rem, 0.7vw, 0.52rem)", // smaller + responsive
    tableLayout: "fixed",
    alignPropType: "center", // force equal column widths
  };

  const headerCellStyle = {
    padding: "0.1rem 0.1rem",
    textAlign: "center",
    wordWrap: "break-word",
    overflow: "hidden",
    textOverflow: "ellipsis",
    fontSize: 9, // inherit from table
  };

  const bodyCellStyle = {
    padding: "0.2rem 0.25rem",
    textAlign: "center",
    fontSize: 15,
  };

  return (
    <Card
      style={{
        margin: 3,
        alignItems: "center",
        width: "100%", // fill the <Col>
        display: "flex",
        flexDirection: "column",
        ...cardStyle,
      }}
    >
      <Card.Img
        variant="top"
        src={item?.image}
        alt={item?.description}
        style={cardImage}
      />
      <Card.Body style={{ textAlign: "center" }}>
        <Card.Title style={{ fontSize: 18, fontWeight: 800 }}>
          {item?.description}
        </Card.Title>
        <h2 style={priceStyle}>
          {" "}
          Price $
          {item?.price?.toFixed ? item.price.toFixed(2) : item?.price || "0.00"}
        </h2>
        <div>
          <Table style={tableStyle}>
            <thead>
              <tr>
                <th style={headerCellStyle}>Calories</th>
                <th style={headerCellStyle}>Protein (g)</th>
                <th style={headerCellStyle}>Fat (g)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={bodyCellStyle}>{cals}</td>
                <td style={bodyCellStyle}>{prot}</td>
                <td style={bodyCellStyle}>{fat}</td>
              </tr>
            </tbody>
          </Table>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "wrap",
            marginTop: 20,
          }}
        >
          <Button style={buttonDesign} onClick={handleAddClick}>
            Add
          </Button>

          <div style={qtyWrapperStyle}>
            <button style={qtyButtonStyle} onClick={decrementLocal}>
              −
            </button>
            <Form.Control
              type="text"
              inputMode="numeric"
              value={inputQty}
              aria-label="Quantity to add"
              onChange={handleLocalChange}
              style={qtyInputStyle}
              placeholder="0"
            />
            <button style={qtyButtonStyle} onClick={incrementLocal}>
              +
            </button>
          </div>
        </div>
        {feedback && (
          <div
            role="status"
            aria-live="polite"
            style={{
              marginTop: 8,
              fontSize: 12,
              color: "#2b7a4b",
              textAlign: "center",
            }}
          >
            {feedback}
          </div>
        )}
      </Card.Body>
    </Card>
  );
}
