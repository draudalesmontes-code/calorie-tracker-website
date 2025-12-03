import { Card, Button, Modal } from "react-bootstrap";
import { useMemo, useContext, useState } from "react";
import CalorieCartApp, { AuthContext } from "../../structural/CalorieCartApp";
import { useNavigate } from "react-router";
import CheckoutModalOverCal from "./checkoutModalOver";
import CheckoutModalWithinCal from "./checkoutModalWithin";
import CheckoutModalWeekWithin from "./checkoutOverWeekModal";
export default function CheckoutButtonCard({ items, qty, clearCart }) {
  const { user, setUser } = useContext(AuthContext);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showOverModal, setShowOverModal] = useState(false);
  const [modalStats, setModalStats] = useState(null);
  const [pendingWeekly, setPendingWeekly] = useState(null);
  const [showWithinModal, setShowWithinModal] = useState(false);
  const [showWeekOverModal, setShowWeekOverModal] = useState(false);
  const navigate = useNavigate();
  const listPurchase = (items || []).filter(
    (item) => (qty?.[item.id] || 0) > 0
  );

  const totalPrice = listPurchase.reduce((sum, item) => {
    const quantity = qty?.[item.id] || 0;
    const price = item?.price || 0;
    return sum + quantity * price;
  }, 0);

  const { addCalories, addProtein, addFat } = useMemo(() => {
    let calories = 0;
    let protein = 0;
    let fat = 0;

    for (const item of listPurchase) {
      const quantity = qty?.[item.id] || 0;
      const nutr = item?.nutrition || {};
      const cals = nutr.calories_kcal ?? 0;
      const prot = nutr.protein_g ?? 0;
      const fats = nutr.fat_g ?? 0;

      calories += cals * quantity;
      protein += prot * quantity;
      fat += fats * quantity;
    }
    return { addCalories: calories, addProtein: protein, addFat: fat };
  }, [listPurchase, qty]);

  const weeklyProgress = user?.weeklyProgress ?? {
    caloriesConsumed: 0,
    proteinConsumed: 0,
    fatConsumed: 0,
  };

  const weightLbs = user?.weight ?? 180;
  const totalInches =
    user?.heightFt != null && user?.heightIn != null
      ? user.heightFt * 12 + user.heightIn
      : 68;

  let baseCalories = 2500 + (weightLbs - 180) * 5 + (totalInches - 68) * 5;
  if (baseCalories < 1800) baseCalories = 1800;
  if (baseCalories > 3200) baseCalories = 3200;

  let dailyCalories = baseCalories;
  if (user?.gainSelected) {
    dailyCalories += 300;
  } else if (user?.loseSelected) {
    dailyCalories -= 400;
  }

  const proteinPerLb = user?.gainSelected || user?.loseSelected ? 1.0 : 0.8;
  const proteinGoalDaily = weightLbs * proteinPerLb;
  const fatGoalDaily = (dailyCalories * 0.3) / 9;

  const defaultDailyCalories = Math.round(dailyCalories);
  const defaultDailyProtein = Math.round(proteinGoalDaily);
  const defaultDailyFat = Math.round(fatGoalDaily);

  const weeklyCaloriesGoal =
    user?.weeklyCaloriesGoal ?? defaultDailyCalories * 7;
  const weeklyProteinGoal = user?.weeklyProteinGoal ?? defaultDailyProtein * 7;
  const weeklyFatGoal = user?.weeklyFatGoal ?? defaultDailyFat * 7;

  const dailyCaloriesGoal = Math.round(weeklyCaloriesGoal / 7);

  // + Helper that actually talks to the API (only called on safe path or modal confirm)
  const doCheckout = (updatedWeekly) => {
    setIsCheckingOut(true);
    fetch(
      `https://cs571api.cs.wisc.edu/rest/f25/bucket/account?id=${user.accountId}`,
      {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CS571-ID": CS571.getBadgerId(),
        },
        body: JSON.stringify({ ...user, weeklyProgress: updatedWeekly }),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (!data) return;
        setUser({
          ...user,
          weeklyProgress: updatedWeekly,
        });
        if (typeof clearCart === "function") {
          clearCart();
        }
        navigate("/");
      })
      .finally(() => {
        setIsCheckingOut(false);
        setPendingWeekly(null);
        setShowOverModal(false);
        setShowWithinModal(false);
        setShowWeekOverModal(false);
      });
  };

  const handleCheckout = () => {
    if (listPurchase.length === 0) {
      alert("Your cart is empty.");
      return;
    }
    const prev = weeklyProgress;
    const updatedWeekly = {
      caloriesConsumed: prev.caloriesConsumed + addCalories,
      proteinConsumed: prev.proteinConsumed + addProtein,
      fatConsumed: prev.fatConsumed + addFat,
    };

    const dailyCaloriesAfter = updatedWeekly.caloriesConsumed / 7;
    const weeklyCaloriesAfter = updatedWeekly.caloriesConsumed;
    const weeklyWouldExceed = weeklyCaloriesAfter > weeklyCaloriesGoal;

    const statsForModal = {
      dailyCaloriesGoal,
      dailyCaloriesAfter,
      weeklyCaloriesGoal,
      weeklyCaloriesAfter,
      weeklyProteinGoal,
      weeklyProteinAfter: updatedWeekly.proteinConsumed,
      weeklyFatGoal,
      weeklyFatAfter: updatedWeekly.fatConsumed,
    };

    setModalStats(statsForModal);

    if (weeklyWouldExceed) {
      setShowWeekOverModal(true);
      setPendingWeekly(null);
      return;
    }

    setPendingWeekly(updatedWeekly);

    const triggersOverDaily =
      addCalories > dailyCaloriesGoal || dailyCaloriesAfter > dailyCaloriesGoal;

    if (triggersOverDaily) {
      setShowOverModal(true); // daily over-limit modal with Confirm
      return;
    }

    // Within daily + weekly → success modal, then checkout on OK
    setShowWithinModal(true);
  };

  return (
    <>
      <Card
        style={{
          marginTop: 30,
          borderRadius: 21,
          boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
          position: "sticky",
          fontFamily: "sans-serif",
          top: 20,
        }}
        id="checkout"
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
          <div> Checkout</div>
        </Card.Header>
        <Card.Body>
          <div style={{ maxHeight: 180, overflowY: "auto", marginBottom: 8 }}>
            {listPurchase.length === 0 ? (
              <div style={{ fontStyle: "italic", color: "#666", fontSize: 14 }}>
                Your cart is empty.
              </div>
            ) : (
              listPurchase.map((item) => {
                const quantity = qty?.[item.id] || 0;
                const itemTotal = (item?.price || 0) * quantity;
                return (
                  <div
                    key={item.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 4,
                      fontSize: 14,
                    }}
                  >
                    <span>
                      {item.description} x {quantity}
                    </span>
                    <span>${itemTotal.toFixed(2)}</span>
                  </div>
                );
              })
            )}
          </div>
          <hr />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 14,
              color: "#555",
              marginBottom: 12,
            }}
          >
            <span>Total calories this purchase</span>
            <span>
              <strong>{Math.round(addCalories)} cal</strong>
            </span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 14,
              color: "#555",
              marginBottom: 12,
            }}
          >
            <span>Total Protein this purchase</span>
            <span>
              <strong>{Math.round(addProtein)} cal</strong>
            </span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 14,
              color: "#555",
              marginBottom: 12,
            }}
          >
            <span>Total Fat this purchase</span>
            <span>
              <strong>{Math.round(addFat)} cal</strong>
            </span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontWeight: "bold",
              fontSize: 16,
              marginBottom: 12,
            }}
          >
            <span>Total</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Button
              style={{ borderRadius: 15, width: "100%" }}
              onClick={handleCheckout}
              disabled={isCheckingOut || listPurchase.length === 0}
            >
              {isCheckingOut ? "Processing..." : "Proceed to Checkout"}
            </Button>
          </div>
        </Card.Body>
      </Card>
      <CheckoutModalOverCal
        show={showOverModal}
        onHide={() => {
          setShowOverModal(false);
          setPendingWeekly(null);
        }}
        stats={modalStats}
        isCheckingOut={isCheckingOut}
        onConfirm={() => {
          if (!pendingWeekly) {
            setShowOverModal(false);
            return;
          }
          setShowOverModal(false);
          doCheckout(pendingWeekly);
        }}
      />
      <CheckoutModalWithinCal
        show={showWithinModal}
        onHide={() => {
          setShowWithinModal(false);
          setPendingWeekly(null);
        }}
        stats={modalStats}
        isCheckingOut={isCheckingOut}
        onConfirm={() => {
          if (!pendingWeekly) {
            setShowWithinModal(false);
            return;
          }
          setShowWithinModal(false);
          doCheckout(pendingWeekly);
        }}
      />
      <CheckoutModalWeekWithin
        show={showWeekOverModal}
        onHide={() => {
          setShowWeekOverModal(false);
        }}
        stats={modalStats}
        isCheckingOut={isCheckingOut}
        onConfirm={() => {
          // Weekly limit is a hard stop: just close, DO NOT call checkout.
          setShowWeekOverModal(false);
        }}
      />
    </>
  );
}
