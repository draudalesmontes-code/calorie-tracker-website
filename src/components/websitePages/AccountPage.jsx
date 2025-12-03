import { useState, useMemo, useContext, useEffect } from "react";
import {
  Form,
  Button,
  Card,
  Container,
  Row,
  Col,
  FloatingLabel,
  Alert,
  ProgressBar,
  ToggleButton,
  ToggleButtonGroup,
  Modal,
  
} from "react-bootstrap";
import EditGoal from "./componentsPage/editGoals.jsx";
import DailyGoalsCard from "./componentsPage/dailyGoalsCard.jsx";
import svgBackground from "../../assets/backLogin.svg";
import CardAccount from "./componentsPage/cardAccount.jsx";
import GoalsCardAccount from "./componentsPage/goalsCardAccount.jsx";
import { AuthContext } from "../structural/CalorieCartApp.jsx";
import EditAccount from "./componentsPage/editAccount.jsx"; 


export default function store() {
  const { user, setUser } = useContext(AuthContext);
  const weightLbs = user?.weight ?? 180; // default if not set
  
  const [showEditGoals, setShowEditGoals] = useState(false);
  const [showEditAccount, setShowEditAccount] = useState(false);

  
    const totalInches =
      user?.heightFt != null && user?.heightIn != null
        ? user.heightFt * 12 + user.heightIn
        : 68; 
    let baseCalories =
      2500 +
      (weightLbs - 180) * 5 + 
      (totalInches - 68) * 5;
      if (baseCalories < 1800) baseCalories = 1800;
        if (baseCalories > 3200) baseCalories = 3200;
      
        let dailyCalories = baseCalories;
        if (user?.gainSelected) {
          dailyCalories += 300;
        } else if (user?.loseSelected) {
          dailyCalories -= 400;
        }
      
        const proteinPerLb =
          user?.gainSelected || user?.loseSelected ? 1.0 : 0.8;
        const proteinGoal = weightLbs * proteinPerLb;
      
        const fatGoal = (dailyCalories * 0.3) / 9;

        const weeklyProgress = user?.weeklyProgress ?? {
              caloriesConsumed: 0,
              proteinConsumed: 0,
              fatConsumed: 0,
          }; 

          const defaultDailyCalories = Math.round(dailyCalories);
          const defaultDailyProtein = Math.round(proteinGoal);
          const defaultDailyFat = Math.round(fatGoal);
        
          const weeklyCaloriesGoal =
            user?.weeklyCaloriesGoal ?? defaultDailyCalories * 7;
          const weeklyProteinGoal =
            user?.weeklyProteinGoal ?? defaultDailyProtein * 7;
          const weeklyFatGoal =
            user?.weeklyFatGoal ?? defaultDailyFat * 7;





          const dailyGoals = {
            caloriesConsumed: weeklyProgress.caloriesConsumed/7,                   
            caloriesGoal: Math.round(weeklyCaloriesGoal/7),
            proteinConsumed: weeklyProgress.proteinConsumed/7,
            proteinGoal: Math.round(weeklyProteinGoal/7),
            fatConsumed: weeklyProgress.fatConsumed/7,
            fatGoal: Math.round(weeklyFatGoal/7),
          };
        
     
        const weeklyGoals = {
          caloriesConsumed: weeklyProgress.caloriesConsumed,
          caloriesGoal: weeklyCaloriesGoal,
          proteinConsumed: weeklyProgress.proteinConsumed,
          proteinGoal: weeklyProteinGoal,
          fatConsumed: weeklyProgress.fatConsumed,
          fatGoal:weeklyFatGoal,
       };



  return (
    <div style={{ position: "relative", height: "100%" }}>
      <img
        src={svgBackground}
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
      <Container
        fluid
        style={{
          position: "relative",
          zIndex: 1,
          paddingTop: 24,
        
          paddingBottom: 24,
        }}
      >
        <h1 hidden={true}>Account Page</h1>
        <div
          style={{
            maxWidth: 1100,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
        <Row style={{ alignItems: "center", display: "flex" }}>
          <Col xs={12} md={4} style={{ marginBottom: 16 }}>
            <CardAccount user={user} 

          onEdit={() => setShowEditAccount(true)}  />
          </Col>
          <Col xs={12} md={8} style={{ marginBottom: 16 }}>
          <GoalsCardAccount 
             weeklyGoals={weeklyGoals}
             gainSelected={user?.gainSelected}
            loseSelected={user?.loseSelected}
             onEditGoals={() => setShowEditGoals(true)}
            />
          </Col>
        </Row>
       
        <Row >
            <Col xs={12} style={{ marginBottom: 16 }}>
              <DailyGoalsCard values={dailyGoals} />
              
            </Col>
          </Row>
          </div>
      </Container>
      <EditAccount
        show={showEditAccount}
        onHide={() => setShowEditAccount(false)}
      />
      <EditGoal 
    show={showEditGoals}
    onHide={() => setShowEditGoals(false)}
    weeklyGoals={weeklyGoals}
  gainSelected={user?.gainSelected}
  loseSelected={user?.loseSelected}
      />

  
    </div>
  );
}
