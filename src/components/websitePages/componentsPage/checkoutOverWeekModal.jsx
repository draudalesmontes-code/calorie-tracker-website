import { Modal, Button, Row, Col } from "react-bootstrap";
import warningIcon from "../../../assets/warning.svg";
import caloriesIcon from "../../../assets/calories.svg";
import butterIcon from "../../../assets/butter.svg";
import proteinIcon from "../../../assets/protein.svg";


export default function CheckoutModalWeekWithin({
  show,
  onHide,
  stats,
  onConfirm,
  isCheckingOut,

}) {
    if (!stats) {
        stats = {};
      }
    
      const {
        weeklyCaloriesGoal = 0,
        weeklyCaloriesAfter = 0,
        weeklyProteinGoal = 0,
        weeklyProteinAfter = 0,
        weeklyFatGoal = 0,
        weeklyFatAfter = 0,
      } = stats;
    
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header>
        <Modal.Title><strong> Warning</strong></Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <div style={{ marginBottom: 16 }}>
          <h4 style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <img
              src={warningIcon}
              alt="warning"
              style={{ width: 32, height: 32 }}
            />
            Weekly Calories
          </h4>
          <p style={{ marginBottom: 4 }}>
            Weekly Calorie goal: <strong>{Math.round(weeklyCaloriesGoal)} cal</strong>
          </p>
          <p style={{ marginBottom: 4 }}>
           Calories above weekly limit by {" "}
            <strong>{Math.round(weeklyCaloriesAfter-weeklyCaloriesGoal)} cal</strong>

          </p>
        </div>
      <div style={{ marginBottom: 16 }}>
          <h4>Weekly Stats</h4>
          <p style={{ marginBottom: 8 }}>Weekly calories, fat and protein after purchace.</p>
          <Row>
            <Col xs={12} md={4} style={{ textAlign: "center", marginBottom: 12 }}>
              <h5>Calories</h5>
              <img
                src={caloriesIcon}
                alt="calories"
                style={{ width: 40, height: 40, marginBottom: 4 }}
              />
              <p style={{ marginBottom: 0 }}>
                {Math.round(weeklyCaloriesAfter)} /{" "}
                {Math.round(weeklyCaloriesGoal)} cal
              </p>
            </Col>

            <Col xs={12} md={4} style={{ textAlign: "center", marginBottom: 12 }}>
              <h5>Protein</h5>
              <img
                src={proteinIcon}
                alt="protein"
                style={{ width: 40, height: 40, marginBottom: 4 }}
              />
              <p style={{ marginBottom: 0 }}>
                {Math.round(weeklyProteinAfter)} /{" "}
                {Math.round(weeklyProteinGoal)} g
              </p>
            </Col>

            <Col xs={12} md={4} style={{ textAlign: "center", marginBottom: 12 }}>
              <h5>Fat</h5>
              <img
                src={butterIcon}
                alt="fat"
                style={{ width: 40, height: 40, marginBottom: 4 }}
              />
              <p style={{ marginBottom: 0 }}>
                {Math.round(weeklyFatAfter)} / {Math.round(weeklyFatGoal)} g
              </p>
            </Col>
          </Row>
        </div>
        <h3>Checkout Canceled.</h3>
        <h3>Stay within calorie goals.</h3>
      </Modal.Body>
      <Modal.Footer>
    
        <Button
          variant="primary"
          onClick={onConfirm}
          disabled={isCheckingOut}
        >
          Okay
        </Button>
      </Modal.Footer>
    </Modal>
  );
}