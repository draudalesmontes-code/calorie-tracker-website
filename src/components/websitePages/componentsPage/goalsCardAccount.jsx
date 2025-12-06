import {
  Card,
  Button,
  ProgressBar,
  ToggleButton,
  ToggleButtonGroup,
} from "react-bootstrap";
import { useState, useEffect } from "react";
export default function goalsCardAccount({
  weeklyGoals,
  loseSelected,
  gainSelected,
  onEditGoals,
}) {
  const caloriesConsumed = weeklyGoals.caloriesConsumed ?? 0;
  const caloriesGoal = weeklyGoals.caloriesGoal ?? 2500 * 7;
  const proteinConsumed = weeklyGoals.proteinConsumed ?? 0;
  const proteinGoal = weeklyGoals.proteinGoal ?? 140 * 7;
  const fatConsumed = weeklyGoals.fatConsumed ?? 0;
  const fatGoal = weeklyGoals.fatGoal ?? 80 * 7;

  const caloriesPct = caloriesGoal
    ? Math.min(100, (caloriesConsumed / caloriesGoal) * 100)
    : 0;
  const proteinPct = proteinGoal
    ? Math.min(100, (proteinConsumed / proteinGoal) * 100)
    : 0;
  const fatPct = fatGoal ? Math.min(100, (fatConsumed / fatGoal) * 100) : 0;

  return (
    <Card
      style={{
        width: "8vrem",
        height: "2vrem",
        borderRadius: 20,
        display: "flex",
      }}
      id="Account Goals"
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
        <Card.Title style={{ alignItems: "center" }}>Weekly Goals</Card.Title>

        <Button
          size="sm"
          variant="light"
          style={{ color: "#2b7a4b", borderRadius: 10 }}
          onClick={onEditGoals}
        >
          Edit
        </Button>
      </Card.Header>

      <Card.Body style={{ padding: 20 }}>
        <div style={{ marginTop: 10 }}>
          <h2 style={{ fontSize: "1.25rem", marginBottom: "0.25rem" }}>
            Calories Consumed
          </h2>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span style={{ fontSize: 14, fontWeight: 500 }}>
              {caloriesConsumed}
            </span>
            <div style={{ flex: 1, margin: "8px" }}>
              <ProgressBar
                style={{
                  "--bs-progress-bar-bg": "#288500",
                  fontWeight: 600,
                }}
                now={caloriesPct}
                label="Calories"
              />
            </div>
            <span style={{ fontSize: 14, fontWeight: 500 }}>
              {caloriesGoal}
            </span>
          </div>
        </div>

        <div style={{ marginTop: 20 }}>
          <h2 style={{ fontSize: "1.25rem", marginBottom: "0.25rem" }}>
            Protein Consumed
          </h2>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span style={{ fontSize: 14, fontWeight: 500 }}>
              {proteinConsumed}g
            </span>
            <div style={{ flex: 1, margin: " 8px" }}>
              <ProgressBar
                style={{
                  "--bs-progress-bar-bg": "#C82C09",
                  fontWeight: 600,
                }}
                now={proteinPct}
                label="Protein"
              />
            </div>
            <span style={{ fontSize: 14, fontWeight: 500 }}>
              {proteinGoal}g
            </span>
          </div>
        </div>

        <div style={{ marginTop: 20 }}>
          <h2 style={{ fontSize: "1.25rem", marginBottom: "0.25rem" }}>
            Fat Consumed
          </h2>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span style={{ fontSize: 14, fontWeight: 500 }}>
              {fatConsumed}g
            </span>
            <div style={{ flex: 1, margin: " 8px" }}>
              <ProgressBar
                now={fatPct}
                label="fat"
                style={{
                  "--bs-progress-bar-bg": "#007BC7",
                  height: "18px",
                  fontWeight: 600,
                  borderRadius: "8px",
                }}
              />
            </div>

            <span style={{ fontSize: 14, fontWeight: 500 }}>{fatGoal}g</span>
          </div>
        </div>
        <div style={{ marginTop: 8, marginBottom: 8 }}>
          <ToggleButton
            id="goal-gain"
            type="checkbox"
            variant={gainSelected ? "primary" : "outline-primary"}
            checked={gainSelected}
            disabled
            value="gain"
            style={{
              marginRight: 8,
              backgroundColor: gainSelected ? "#0260EDF2" : "transparent",
              borderColor: "#0260EDF2",
              color: gainSelected ? "#ffffff" : "#0260EDF2",
              opacity: 1, // kill disabled dimming// kill disabled dimming
            }}
          >
            Gain Weight
          </ToggleButton>

          <ToggleButton
            id="goal-lose"
            type="checkbox"
            variant={loseSelected ? "primary" : "outline-primary"}
            checked={loseSelected}
            disabled
            // className="goal-toggle"
            style={{
              backgroundColor: loseSelected ? "#0260EDF2" : "transparent",
              borderColor: "#0260EDF2",
              color: loseSelected ? "#ffffff" : "#0260EDF2",
              opacity: 1, // kill disabled dimming
            }}
            value="lose"
          >
            Lose Weight
          </ToggleButton>
        </div>
      </Card.Body>
    </Card>
  );
}
