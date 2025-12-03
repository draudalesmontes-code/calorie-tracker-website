import { useState, useEffect, useContext } from "react";
import { Button, Modal, Form, Row, Col } from "react-bootstrap";
import { AuthContext } from "../../structural/CalorieCartApp.jsx";

const MIN_DAILY_CAL = 1800;
const MAX_DAILY_CAL = 3200;
const MIN_WEEKLY_CAL = MIN_DAILY_CAL * 7;
const MAX_WEEKLY_CAL = MAX_DAILY_CAL * 7;
export default function editGoal({
  show,
  onHide,
  gainSelected,
  loseSelected,
  weeklyGoals,
}) {
  const [weeklyCalories, setWeeklyCalories] = useState("");
  const [weeklyProtein, setWeeklyProtein] = useState("");
  const [weeklyFat, setWeeklyFat] = useState("");
  const [localGainSelected, setLocalGainSelected] = useState(true);
  const [localLoseSelected, setLocalLoseSelected] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const { user, setUser } = useContext(AuthContext);

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
      const calGoal = weeklyGoals?.caloriesGoal ?? 0;
      const protGoal = weeklyGoals?.proteinGoal ?? 0;
      const fatGoal = weeklyGoals?.fatGoal ?? 0;

      const gainFlag = gainSelected ?? user.gainSelected;
      const loseFlag = loseSelected ?? user.loseSelected;

      setLocalGainSelected(gainFlag);
      setLocalLoseSelected(loseFlag);
      setError("");

      if (calGoal || protGoal || fatGoal) {
        // Use existing saved goals
        setWeeklyCalories(calGoal ? String(calGoal) : "");
        setWeeklyProtein(protGoal ? String(protGoal) : "");
        setWeeklyFat(fatGoal ? String(fatGoal) : "");
      } else {
        // No saved goals → auto-fill from recommended values
        const rec = recommendedWeeklyCalories(user, gainFlag, loseFlag);
        if (rec) {
          setWeeklyCalories(String(rec.weeklyCalories));
          setWeeklyProtein(String(rec.weeklyProtein));
          setWeeklyFat(String(rec.weeklyFat));
        } else {
          setWeeklyCalories("");
          setWeeklyProtein("");
          setWeeklyFat("");
        }
      }
    }
  }, [show, user, weeklyGoals, gainSelected, loseSelected]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const wkCal = Number(weeklyCalories);
    const wkProt = Number(weeklyProtein);
    const wkFat = Number(weeklyFat);

    if (
      Number.isNaN(wkCal) ||
      Number.isNaN(wkProt) ||
      Number.isNaN(wkFat) ||
      wkCal <= 0 ||
      wkProt <= 0 ||
      wkFat <= 0
    ) {
      setError("Weekly calories, protein, and fat must be positive numbers.");
      return;
    }

    let clampedWeeklyCalories = wkCal;
    if (clampedWeeklyCalories < MIN_WEEKLY_CAL) {
      alert(
        "You can't go lower than 1800 calories a day or 12600 calories weekly!"
      );
      clampedWeeklyCalories = MIN_WEEKLY_CAL;
    }
    if (clampedWeeklyCalories > MAX_WEEKLY_CAL) {
      clampedWeeklyCalories = MAX_WEEKLY_CAL;
      alert("You can't go over 3200 calories a day or 22400 calories weekly!");
    }

    const prevWeekly = user?.weeklyProgress;
    const newGain = !!localGainSelected;
    const newLose = !!localLoseSelected;

    const body = {
      ...user,
      gainSelected: newGain,
      loseSelected: newLose,
      weeklyProgress: prevWeekly,
      weeklyCaloriesGoal: clampedWeeklyCalories,
      weeklyProteinGoal: wkProt,
      weeklyFatGoal: wkFat,
    };

    setSaving(true);
    fetch(
      `https://cs571api.cs.wisc.edu/rest/f25/bucket/account?id=${user.accountId}`,
      {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CS571-ID": CS571.getBadgerId(),
        },
        body: JSON.stringify(body),
      }
    )
      .then((res) => res.json())
      .then(() => {
        setUser({
          ...user,
          gainSelected: newGain,
          loseSelected: newLose,
          weeklyProgress: prevWeekly,
          weeklyCaloriesGoal: clampedWeeklyCalories,
          weeklyProteinGoal: wkProt,
          weeklyFatGoal: wkFat,
        });
        onHide();
      })
      .finally(() => {
        setSaving(false);
      });
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Weekly Goals</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && (
            <div
              style={{
                marginBottom: 12,
                color: "red",
                fontSize: 14,
              }}
            >
              {error}
            </div>
          )}

          {/* Goal buttons: just set booleans */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ marginBottom: 6, fontWeight: 500 }}>Goal</div>
            <div>
              <Button
                size="sm"
                type="button"
                variant={localGainSelected ? "primary" : "outline-primary"}
                onClick={() => {
                  const newGain = true;
                  const newLose = false;
                  setLocalGainSelected(true);
                  setLocalLoseSelected(false);
                  const rec = recommendedWeeklyCalories(user, newGain, newLose);
                  if (rec) {
                    setWeeklyCalories(String(rec.weeklyCalories));
                    setWeeklyProtein(String(rec.weeklyProtein));
                    setWeeklyFat(String(rec.weeklyFat));
                  }
                }}
                style={{ marginRight: 8 }}
              >
                Gain
              </Button>
              <Button
                size="sm"
                type="button"
                variant={localLoseSelected ? "primary" : "outline-primary"}
                onClick={() => {
                  const newGain = false;
                  const newLose = true;
                  setLocalLoseSelected(newLose);
                  setLocalGainSelected(newGain);
              
                  const rec = recommendedWeeklyCalories(user, newGain, newLose);
                  if (rec) {
                    setWeeklyCalories(String(rec.weeklyCalories));
                    setWeeklyProtein(String(rec.weeklyProtein));
                    setWeeklyFat(String(rec.weeklyFat));
                  }
                }}
              >
                Lose
              </Button>
            </div>
          </div>

          <Form.Group
            style={{ marginBottom: 12 }}
            controlId="weeklyCaloriesGoal"
          >
            <Form.Label>Weekly Calories Goal</Form.Label>
            <Form.Control
              type="number"
              min={0}
              value={weeklyCalories}
              onChange={(e) => setWeeklyCalories(e.target.value)}
            />
            <Form.Text style={{ fontSize: 12, color: "#6c757d" }}>
              Calories
            </Form.Text>
          </Form.Group>

          <Row>
            <Col xs={6}>
              <Form.Group
                style={{ marginBottom: 12 }}
                controlId="weeklyProteinGoal"
              >
                <Form.Label>Weekly Protein (g)</Form.Label>
                <Form.Control
                  type="number"
                  min={0}
                  value={weeklyProtein}
                  onChange={(e) => setWeeklyProtein(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col xs={6}>
              <Form.Group
                style={{ marginBottom: 12 }}
                controlId="weeklyFatGoal"
              >
                <Form.Label>Weekly Fat (g)</Form.Label>
                <Form.Control
                  type="number"
                  min={0}
                  value={weeklyFat}
                  onChange={(e) => setWeeklyFat(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
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
