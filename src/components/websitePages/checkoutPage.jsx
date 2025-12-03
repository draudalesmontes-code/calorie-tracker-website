import { Card, Container, Col, Row, Modal } from "react-bootstrap";
import CheckoutButtonCard from "./componentsPage/checkoutButtonCard.jsx";
import CheckoutComponent from "./componentsPage/checkoutComponent.jsx";
import { useMemo, useState } from "react";
import { AuthContext } from "../structural/CalorieCartApp.jsx";
export default function checkout({
  items,
  qty,
  add,
  subtract,
  handleQtyChange,
  removeItem,
  clearCart,
}) {


  
  return (
    <div>
      <Container>
          <h1 style={{margin:20, textAlign:"center"}}>Checkout Page</h1>
        <Row>
          <Col xs={12} md={8}>
            <CheckoutComponent
              items={items}
              qty={qty}
              add={add}
              subtract={subtract}
              handleQtyChange={handleQtyChange}
              removeItem={removeItem}
            />
          </Col>

          <Col xs={12} md={4}>
            <CheckoutButtonCard items={items} qty={qty} clearCart={clearCart}/>
          </Col>
        </Row>
        <Modal>
          {
            <div>
              <h2>You are still have # daily calories</h2>
              <h2>
                You are still have # weekly calories look at your account for
                more specific on protein, and fat weekly and daily
              </h2>
            </div>
          }
        </Modal>
      </Container>
    </div>
  );
}
