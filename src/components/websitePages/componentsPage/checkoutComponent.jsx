import { Card, Col, Row } from "react-bootstrap";
import { useMemo } from "react";
import CheckoutItems from "./checkoutItems.jsx";
export default function CheckoutComponent({items,
  qty,
  add,
  subtract,
  handleQtyChange,
  removeItem,
}
) {

  const cartItems = useMemo(
    () => (items ?? []).filter((item) => (qty?.[item.id] || 0) > 0),
    [items, qty]
  );
  
return(

    <Card 
    style={{
      marginTop:30,
      borderRadius: 21,
      boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
      fontFamily: "sans-serif",
    }}
    id="checkout"
  >
    <Card.Header
   style={{
    backgroundColor: "#367C49",
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 16px",

  }}
    >
      <div> Cart</div>
         </Card.Header>
        <Card.Body>
        {cartItems.length === 0 ? (
          <div>Your cart is empty.</div>
        ) : (
          cartItems.map((item) => (
            <div key={item.id} style={{ marginBottom: 12 }}>
              <CheckoutItems
                item={item}
                qty={qty?.[item.id] || 0}
                add={() => add(item.id)}
                subtract={() => subtract(item.id)}
                handleQtyChange={(e) => handleQtyChange(item.id, e)}
                removeItem={() => removeItem(item.id)}
              />
              <hr style={{ margin: "8px 0", opacity: 0.3 }} />
            </div>
          ))
        )}
        </Card.Body>
    </Card>

);
}