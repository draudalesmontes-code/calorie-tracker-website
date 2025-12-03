import { Container, Carousel, Image, Col, Row } from "react-bootstrap";

import imageCaltrack from "../../images/trackCals.png";
import exercise from "../../images/exercise.png";
import healthyDiet from "../../images/healthyDiet.png";
import CartComponent from "./componentsPage/cartComponent.jsx";

const heroStyle = {
  width: "100%",
  height: "60vh",
  objectFit: "cover",
  display: "block",
};

const titleStyle = {
  textAlign: "center",
  fontFamily: `'Poppins'`,
  fontWeight: 700,
  letterSpacing: "0.5px",
  margin: "24px 0", // equal space above/below
  color: "#213547",
};

export default function HomePage(
  {items = [],
  qty,
  add,
  subtract,
  handleQtyChange}
) {
  const dealItems = Array.isArray(items)
    ? items.filter((it) => !!it.discount)
    : [];
  const captionStyle ={
    position:"absolute",
    textAlign:"center",
    transform: "translate(-50%, -50%)",
    width:"100%",
    top:"50%",
    left:"50%",
    padding: "0 16px", 

  };
  const captionTitleStyle = {
    textAlign:"center",
    fontSize: "2.5rem",                                 
    fontWeight: 700, 
    width:"40%",
    borderRadius:20,
    backgroundColor: "#367C49",
    margin: "0 auto 8px",        
    padding: "8px 16px",        
    color: "white",         
  };
  const textStyle = {
      fontSize: "1.25rem",  
      borderRadius:20,
      backgroundColor: "#367C49",
      margin: "0 auto ",        
      color: "white",  
      display: "inline-block",
      padding: "6px 12px"                       
  };
  return (
    <Container fluid style={{ padding: 0 }}>
      <div>
        <h1 style={titleStyle}>Calorie Cart</h1>
        <Carousel>
          <Carousel.Item>
            <Image src={imageCaltrack} alt="Image of balance meal" style={heroStyle} />
            <Carousel.Caption style={captionStyle}>
              <h2 style={captionTitleStyle}>Welcome to Calorie Cart</h2>
              <p style={textStyle}> Experience shopping with Calorie tracking.</p>
            </Carousel.Caption>
          </Carousel.Item>

          <Carousel.Item>
            <Image src={healthyDiet} alt="Image of healthy food" style={heroStyle} />
            <Carousel.Caption style={captionStyle}>
              <h2 style={captionTitleStyle}>Meet your Goals</h2>
              <p style={textStyle}>Calorie cart helps you meet the dietary goals you want to meet.</p>
            </Carousel.Caption>
          </Carousel.Item>

          <Carousel.Item>
            <Image src={exercise} alt="Image of Person Exercising" style={heroStyle} />
            <Carousel.Caption style={captionStyle}>
              <h2 style={captionTitleStyle}>Meet Your Gym Goals</h2>
              <p style={textStyle}>With a shopping that keeps you accountable of what you are eating achieve the physique you want.</p>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
      </div>
      <div style={{ paddingInline: 16 }}>
        <h1
          style={{
            margin: "2%",
            justifySelf: "center",
            fontFamily: `'Poppins'`,
          }}
        >
          Deals
        </h1>
        <Row xs={1} sm={2} md={3} lg={4} xl={5} style={{ marginBottom: 20 }}>
          {dealItems.map((item) => {
            const id = item.id;
            const thisQty = qty?.[id];

            return (
              <Col key={id}>
                <CartComponent
                  style={{ width: "20%" }}
                  item={item}
                  qty={thisQty}
                  add={() => add(id)}
                  subtract={() => subtract(id)}
                  handleQtyChange={(e) => handleQtyChange(id, e)}
                />
              </Col>
            );
          })}
        </Row>
      </div>
    </Container>
  );
}
