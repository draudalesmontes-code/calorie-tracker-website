// editAccount.jsx
import { useContext, useEffect, useState } from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";
import { AuthContext } from "../../structural/CalorieCartApp.jsx";
import { useNavigate } from "react-router";

// This component IS the modal.
// Parent (AccountPage) will render <EditAccount show={...} onHide={...} />
export default function EditAccount({ show, onHide }) {
  const { user, setUser } = useContext(AuthContext);

  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");
  const [weight, setWeight] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  

  const MIN_DAILY_CAL = 1800;
  const MAX_DAILY_CAL = 3200;
  const recommendedWeeklyCalories = (usr, gain, lose) => {
    const weightLbs = usr?.weight ?? 180;
    const totalInches =
      usr.heightFt && usr.heightIn ? usr.heightFt * 12 + usr.heightIn : 68;
    let baseCalories = 2500 + (weightLbs - 180) * 5 + (totalInches - 68) * 5;

    if (baseCalories < MIN_DAILY_CAL) baseCalories = MIN_DAILY_CAL;
    if (baseCalories > MAX_DAILY_CAL) baseCalories = MAX_DAILY_CAL;

    let dailyCalories = baseCalories;
    if (gain) {
      dailyCalories += 300;
    } else if (lose) {
      dailyCalories -= 400;
    }

    const proteinPerLb = gain || lose ? 1.0 : 0.8;
    const proteinDaily = weightLbs * proteinPerLb;
    const fatDaily = (dailyCalories * 0.3) / 9;

    const weeklyCalories = Math.round(dailyCalories * 7);
    const weeklyProtein = Math.round(proteinDaily * 7);
    const weeklyFat = Math.round(fatDaily * 7);

    return { weeklyCalories, weeklyProtein, weeklyFat };
  };

  useEffect(() => {
    if (show && user) {
      setHeightFt(user.heightFt ?? "");
      setHeightIn(user.heightIn ?? "");
      setWeight(user.weight ?? "");
      setError("");
    }
  }, [show, user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const hFt = Number(heightFt);
    const hIn = Number(heightIn);
    const w = Number(weight);

    if (Number.isNaN(hFt) || Number.isNaN(hIn) || Number.isNaN(w)) {
      setError("Height (ft/in) and weight must be valid numbers.");
      return;
    }
    if (hFt < 0 || hIn < 0 || hIn > 11 || w <= 0) {
      setError("Please enter a realistic height and weight.");
      return;
    }
    const prevWeekly = user?.weeklyProgress || {
      caloriesConsumed: 0,
      proteinConsumed: 0,
      fatConsumed: 0,
    };

    const gain = !!user?.gainSelected;
    const lose = !!user?.loseSelected;
    const rec = recommendedWeeklyCalories(
      { weight: w, heightFt: hFt, heightIn: hIn },
      gain,
      lose
    );

    const body = {
      ...user,
      heightFt: hFt,
      heightIn: hIn,
      weight: w,
      weeklyProgress: prevWeekly,
      weeklyCaloriesGoal: rec.weeklyCalories,
      weeklyProteinGoal: rec.weeklyProtein,
      weeklyFatGoal: rec.weeklyFat,
    };

    setSaving(true);

    fetch(
      `https://cs571api.cs.wisc.edu/rest/f25/bucket/account?id=${user.accountId}`,
      {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CS571-ID": CS571.getBadgerId(), // same pattern as checkout
        },
        body: JSON.stringify(body),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (!data) return;
        setUser({
          ...user,
          heightFt: hFt,
          heightIn: hIn,
          weight: w,
          weeklyProgress: prevWeekly,
          weeklyCaloriesGoal: rec.weeklyCalories,
          weeklyProteinGoal: rec.weeklyProtein,
          weeklyFatGoal: rec.weeklyFat,
        });

        onHide(); // close modal
      })
      .catch((err) => {
        console.error(err);
        setError("Unable to update account right now.");
      })
      .finally(() => {
        setSaving(false);
      });
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Height &amp; Weight</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && (
            <div className="mb-3 text-danger" style={{ fontSize: 14 }}>
              {error}
            </div>
          )}

          <Row className="mb-3">
            <Col xs={6}>
              <Form.Group controlId="editHeightFt">
                <Form.Label>Height (ft)</Form.Label>
                <Form.Control
                  type="number"
                  min={0}
                  value={heightFt}
                  onChange={(e) => setHeightFt(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col xs={6}>
              <Form.Group controlId="editHeightIn">
                <Form.Label>Height (in)</Form.Label>
                <Form.Control
                  type="number"
                  min={0}
                  max={11}
                  value={heightIn}
                  onChange={(e) => setHeightIn(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3" controlId="editWeight">
            <Form.Label>Weight (lbs)</Form.Label>
            <Form.Control
              type="number"
              min={0}
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-secondary"
            type="button"
            onClick={onHide}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={saving}
            style={{
              backgroundColor: "#367C49",
              borderColor: "#367C49",
              fontWeight: "bold",
            }}
          >
            {saving ? "Saving..." : "Save"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
