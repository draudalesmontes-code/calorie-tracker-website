import { Card, Row, Col, Button } from "react-bootstrap";
import CartImage from "../../../assets/cart.svg";
import CircularStat from "./circularStats";
import { useNavigate } from "react-router";
export default function dailyGoalsCard({ title, values }) {
  const caloriesConsumed = values?.caloriesConsumed ?? 0;
  const caloriesGoal = values?.caloriesGoal ?? 2500;
    const navigate = useNavigate();
  const proteinConsumed = values?.proteinConsumed ?? 0;
  const proteinGoal = values?.proteinGoal ?? 140;

  const fatConsumed = values?.fatConsumed ?? 0;
  const fatGoal = values?.fatGoal ?? 80;

  const CardStyle = {
        width: "100%",
        borderRadius: 20,
        boxShadow: "0 6px 16px rgba(0, 0, 0, 0.08)",
        marginTop: 24,
        marginBottom: 30,
      };

  return (
    <Card style={CardStyle}>
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
        <span>{"Daily Goals"}</span>
      </Card.Header>
      <Card.Body>
        <Row style={{
            textAlign: "center",
          
          }}>
          <Col xs={6} md={3}>
            <CircularStat
              label="Calories"
              value={caloriesConsumed}
              max={caloriesGoal}
              color="#288500"
            />
          </Col>

          <Col xs={6} md={3}>
            <CircularStat
              label="Protein (g)"
              value={proteinConsumed}
              max={proteinGoal}
              color="#C82C09"
            />
          </Col>

          <Col xs={6} md={3}>
            <CircularStat
              label="Fat (g)"
              value={fatConsumed}
              max={fatGoal}
              color="#007BC7"
            />
          </Col>

          {/* 4: Continue Shopping */}
          <Col xs={6} md={3}>
            <div
              style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <div style={{ fontWeight: 600 }}>Continue Shopping</div>
              <Button
                type="button"
                variant="primary"
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  padding: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
                  cursor: "pointer",
                  
                }}
                onClick={()=>navigate("/store/protein")}
              >
                <img
                  src={CartImage}
                  alt="Cart"
                  style={{ width: 22, height: 22 }}
                />
              </Button>
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}
