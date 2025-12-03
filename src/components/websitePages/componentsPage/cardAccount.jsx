import { Card, Button } from "react-bootstrap";
import muscleIcon from "../../../assets/muscleIcon.svg";

export default function CardAccount({ user,onEdit }) {
  return (
    <Card
      style={{
        margin: 25,
        height: 400,
        borderRadius: 21,
        boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
        fontFamily: "sans-serif",
      }}
      id="AccountInfo"
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
        <div>Account Info</div>
        <Button
          size="sm"
          variant="light"
          style={{ color: "#2b7a4b", borderRadius: 10 }}
          onClick={onEdit}

        >
          Edit
        </Button>
      </Card.Header>
      <img
        style={{ height: 220, padding: 20 }}
        src={muscleIcon}
        alt="user icon"
      />

      <Card.Body>
      <Card.Title>{user?.userName ?? "Guest"}</Card.Title>

        <Card.Text style={{ marginBottom: 4 }}>
          Height:{" "}
          {user?.heightFt != null && user?.heightIn != null
            ? `${user.heightFt}'${user.heightIn}`
            : "Not set"}{" "}
        </Card.Text>

        <Card.Text style={{ marginBottom: 0 }}>
          Weight: {user?.weight != null ? `${user.weight} lbs` : "Not set"}
        </Card.Text>
      </Card.Body>
    </Card>
  );
}
