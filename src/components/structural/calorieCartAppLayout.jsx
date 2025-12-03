import { Link, useNavigate } from "react-router-dom";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { Container, Navbar, Nav, NavDropdown, Button } from "react-bootstrap";
import crest from "../../assets/uw-crest.svg";
import cart from "../../assets/cart.svg";
import accountIcon from "../../assets/account.svg";
import CheckoutComponent from "../websitePages/componentsPage/checkoutPopOut.jsx";
import { AuthContext } from "./CalorieCartApp.jsx";
export default function CalorieCartAppLayout({ children }) {
  const [items, setItems] = useState([]);
  const [type, setType] = useState(null);
  const [showCart, setShowCart] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  const [qty, setQty] = useState({});
  const removeItem = (id) => {
    setQty((prev) => ({
      ...prev,
      [id]: 0,
    }));
  };
  const add = (id) => {
    setQty((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };
  const subtract = (id) => {
    setQty((prev) => {
      const current = prev[id] || 0;
      const next = Math.max(0, current - 1);
      return { ...prev, [id]: next };
    });
  };

  const clearCart = () => {
    setQty({});
  };

  const handleQtyChange = (id, e) => {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    const next = raw === "" ? 0 : Number(raw);
    setQty((prev) => ({
      ...prev,
      [id]: Number.isNaN(next) ? 0 : next,
    }));
  };

  const { user, setUser } = useContext(AuthContext);

  // basic slug for URL
  const slug = (s = "") =>
    s.toLowerCase().replaceAll("/", "-").replaceAll(" ", "-");

  // Fetch just to populate dropdown types
  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/CS571-F25/p105/main/src/API/items.json"
    )
      .then((r) => r.json())
      .then((d) => setItems(Array.isArray(d?.items) ? d.items : []))
      .catch(() => setItems([]));
  }, []);

  // unique types
  const types = useMemo(() => {
    const set = new Set(items.map((it) => it.type).filter(Boolean));
    return Array.from(set);
  }, [items]);

  const goToStore = (t) => {
    setType(t);
    navigate(`/store/${slug(t)}`);
  };

  const handleLogout = () => {
    setUser(null);
    alert("You have been logged out.");
    navigate("/login");
  };

  return (
    <div>
      <Navbar
        style={{ backgroundColor: "#367C49" }}
        data-bs-theme="dark"
        expand="md"
      >
        <Container fluid>
          <Navbar.Brand
            as={Link}
            to="/"
            style={{ display: "flex", alignItems: "center", marginRight: 16 }}
          >
            <img
              src={crest}
              alt="UW Crest"
              width="40"
              height="40"
              style={{ marginRight: 8 }}
            />
            Badger Website
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="main-navbar" />

          <Navbar.Collapse id="main-navbar">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                marginTop: 4,
                marginBottom: 4,
                flexWrap: "wrap",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <Nav>
                  <NavDropdown
                    title={<span style={{ color: "#fff" }}>Store</span>}
                    className="store-toggle"
                    style={{ marginRight: 12, fontSize: 24 }}
                  >
                    {types.map((t) => (
                      <NavDropdown.Item
                        aria-label={`Store ${t}`}
                        key={t}
                        onClick={() => goToStore(t)}
                      >
                        {t}
                      </NavDropdown.Item>
                    ))}
                  </NavDropdown>
                </Nav>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginTop: 4,
                }}
              >
                {user ? (
                  <Nav.Link
                    aria-label="Logout Button"
                    onClick={handleLogout}
                    style={{ color: "#fff" }}
                  >
                    Logout
                  </Nav.Link>
                ) : (
                  <Nav.Link
                    aria-label="login button"
                    as={Link}
                    to="/login"
                    style={{ color: "#fff" }}
                  >
                    Login
                  </Nav.Link>
                )}

                <Button
                  variant="light"
                  onClick={() => setShowCart(true)}
                  style={{ padding: 4, background: "transparent", border: 0 }}
                  aria-label="Cart"
                >
                  <img src={cart} width="28" height="28" alt="Cart" />
                </Button>

                <Button
                  variant="light"
                  onClick={() => {
                    if (!user) navigate("/login");
                    else navigate("/account");
                  }}
                  style={{
                    width: 36,
                    height: 36,
                    padding: 0,
                    background: "transparent",
                    border: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  aria-label="Account"
                  title="Account"
                >
                  <img src={accountIcon} width="28" height="28" alt="Account" />
                </Button>
              </div>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {children &&
        React.cloneElement(children, {
          items,
          types,
          type,
          setType,
          qty,
          add,
          subtract,
          handleQtyChange,
          removeItem,
          clearCart,
        })}
      <CheckoutComponent
        show={showCart}
        items={items}
        handleClose={() => setShowCart(false)}
        qty={qty}
        add={add}
        subtract={subtract}
        handleQtyChange={handleQtyChange}
        removeItem={removeItem}
        clearCart={clearCart}
      />
    </div>
  );
}
