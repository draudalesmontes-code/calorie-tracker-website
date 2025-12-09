import {
  CardBody,
  Card,
  ButtonGroup,
  ToggleButton,
  Form,
  Row,
  FloatingLabel,
  Button,
  ToggleButtonGroup,
  Container,
  CardTitle,
  Col,
  CardFooter,
} from "react-bootstrap";
import { useNavigate } from "react-router";
import { useCallback, useState, useContext } from "react";
import SvgTexture from "../../assets/backLogin.svg";
import { AuthContext } from "../structural/CalorieCartApp";

export default function register() {
  const [weight, setWeight] = useState(0);
  const [height, setHeight] = useState(0);
  const [userName, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setSubmission] = useState(false);
  const [erroText, setErrorText] = useState("");
  const { setUser } = useContext(AuthContext);
  const [gainSelected, setGainSelected] = useState(true);
  const [loseSelected, setLoseSelected] = useState(false);
  const navigate = useNavigate();

  //set account
  const handleSubmit = () => {
    setErrorText("");

    // simple front-end checks
    if (!userName.trim() || !password || !confirmPassword) {
      setErrorText("Please fill out all required fields.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorText("Passwords do not match.");
      return;
    }
    const ft = Math.floor(height / 12);
    const inch = height % 12;

    setSubmission(true);

    // 1) GET existing accounts from the bucket
    fetch("https://cs571api.cs.wisc.edu/rest/f25/bucket/account", {
      credentials: "include",
      headers: {
        "X-CS571-ID": CS571.getBadgerId(),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const existingAccounts = Object.values(data.results || {});
        const alreadyExists = existingAccounts.some(
          (acc) => acc.userName === userName
        );

        if (alreadyExists) {
          setErrorText("An account with that username already exists.");
          setSubmission(false);
          return Promise.reject("USERNAME_EXISTS");
        }

        return fetch("https://cs571api.cs.wisc.edu/rest/f25/bucket/account", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "X-CS571-ID": CS571.getBadgerId(),
          },
          body: JSON.stringify({
            userName,
            password,
            weight,
            heightFt: ft,
            heightIn: inch,
            gainSelected,
            loseSelected,
            weeklyProgress: {
              caloriesConsumed: 0,
              proteinConsumed: 0,
              fatConsumed: 0,
            },
          }),
        });
      })
      .then((res) => {
        if (!res) return null;
        return res.json();
      })
      .then((created) => {
        if (!created) return;

        const accountId = created.id;

        const newUser = {
          userName,
          password,
          weight,
          heightFt: ft,
          heightIn: inch,
          gainSelected,
          loseSelected,
          accountId,
          weeklyProgress: {
            caloriesConsumed: 0,
            proteinConsumed: 0,
            fatConsumed: 0,
          },
        };

        setUser(newUser);
        console.log(created);
        console.log(accountId);
        alert("Account created! You can now log in.");
        setSubmission(false);
        navigate("/");
      });
  };

  const ft = Math.floor(height / 12);
  const inch = height % 12;

  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
      }}
    >
      <img
        src={SvgTexture}
        alt="background texture"
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          top: 0,
          left: 0,
          objectFit: "cover",
          zIndex: 0,
          animation: "float 20s linear infinite alternate",
        }}
      />

      <Container style={{ position: "relative", zIndex: 1 }}>
      <h1 hidden={true}>Register Page</h1>

        <Card
          style={{
            maxWidth: 720,
            borderRadius: "20px",
            margin: "0 auto", // Add this line
          }}
        >
          <Card.Header
            style={{
              background: "#367C49",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              padding: "18px 16px",
            }}
          >
            {erroText && (
              <div
                style={{
                  color: "#F7F7F7",
                  padding: "8px 16px 0 16px",
                  textAlign: "center",
                  fontSize: "0.95rem",
                }}
              >
                {`*${erroText}`}
              </div>
            )}
            <h2
              className="mb-3 text-center"
              style={{ color: "white", marginTop: 10, fontFamily: "Poppins" }}
            >
              Register
            </h2>
          </Card.Header>

          <CardBody
            style={{
              margin: 16,
              paddingLeft: 16,
              paddingRight: 16,
              paddingBottom: 16,
              paddingTop: 16,
            }}
          >
            <Form>
              <FloatingLabel label="Username" className="mb-3">
                <Form.Control
                  name="username"
                  aria-label="Username"
                  type="text"
                  placeholder="Username"
                  autoComplete="none"
                  value={userName}
                  onChange={(user) => setUsername(user.target.value)}
                />
              </FloatingLabel>

              <FloatingLabel label="Password" className="mb-3">
                <Form.Control
                  aria-label="Password"
                  name="password"
                  type="password"
                  placeholder="Password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(userPass) => setPassword(userPass.target.value)}
                />
              </FloatingLabel>

              <FloatingLabel label="Pre-Password" className="mb-3">
                <Form.Control
                  aria-label="Confirm Password"
                  name="pre-password"
                  type="password"
                  placeholder="Confirm Password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(confimPass) =>
                    setConfirmPassword(confimPass.target.value)
                  }
                />
              </FloatingLabel>

              <Col
                md={8}
                xs={12}
                style={{ paddingRight: 8, paddingLeft: 8, marginBottom: 8 }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    marginBottom: 6,
                  }}
                >
                  <Col>
                    <Form.Label>
                      Weight {weight > 0 && `: ${weight} lbs`}
                    </Form.Label>
                    <Form.Range
                      min={80}
                      max={400}
                      value={weight}
                      aria-label={`Weight Selection ${weight} pounds`}
                      onChange={(e) => setWeight(Number(e.target.value))}
                    />
                  </Col>
                </div>
              </Col>

              <Col
                md={8}
                xs={12}
                style={{ paddingRight: 8, paddingLeft: 8, marginBottom: 8 }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    marginBottom: 6,
                  }}
                >
                  <Col>
                    <Form.Label>
                      Height{" "}
                      {height > 0 && `: ${ft} ft ${inch} in (${height}")`}
                    </Form.Label>
                    <Form.Range
                      min={48}
                      max={84}
                      value={height}
                      aria-label={`Height Selection ${height} pounds`}
                      onChange={(e) => setHeight(Number(e.target.value))}
                    />
                  </Col>
                </div>
              </Col>

              <div style={{ marginTop: 8, marginBottom: 8 }}>
  <ToggleButtonGroup
    type="radio"
    name="goal"
    value={gainSelected ? "gain" : "lose"} // derives the radio value from your states
    onChange={(val) => {
      setGainSelected(val === "gain");
      setLoseSelected(val === "lose");
    }}
  >
    <ToggleButton
      id="goal-gain"
      value="gain"
      variant={gainSelected ? "primary" : "outline-primary"}
      style={{ marginRight: 8 }}
    >
      Gain Weight
    </ToggleButton>

    <ToggleButton
      id="goal-lose"
      value="lose"
      variant={loseSelected ? "primary" : "outline-primary"}
    >
      Lose Weight
    </ToggleButton>
  </ToggleButtonGroup>
</div>

              <br />
            </Form>
          </CardBody>
          <CardFooter style={{ padding: 0, borderTop: "none" }}>
            <Button
              variant="primary"
              type="button"
              disabled={isSubmitting}
              style={{
                display: "block",
                width: "100%",
                paddingTop: 16,
                paddingBottom: 16,
                borderRadius: 0,
                borderBottomLeftRadius: 20,
                borderBottomRightRadius: 20,
                fontWeight: 700,
                fontSize: 18,
              }}
              onClick={handleSubmit}
            >
              {isSubmitting ? "Registering..." : "Register"}
            </Button>
          </CardFooter>
        </Card>
      </Container>
    </div>
  );
}
