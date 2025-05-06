import React, { useState, useEffect, useRef } from "react";
import { Row, Container, Col, Button, Modal, Form } from "react-bootstrap";

const TurnTimer = () => {
  const [p1Time, setP1Time] = useState(0);
  const [p2Time, setP2Time] = useState(0);
  const [p1Times, setP1Times] = useState([]);
  const [p2Times, setP2Times] = useState([]);
  const [currentP1Turn, setCurrentP1Turn] = useState(0);
  const [currentP2Turn, setCurrentP2Turn] = useState(0);
  const [totalTurns, setTotalTurns] = useState(0);
  const [playerTurn, setPlayerTurn] = useState(1);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  const [showModal, setShowModal] = useState(false);
  const [p1Name, setP1Name] = useState("Player 1");
  const [p2Name, setP2Name] = useState("Player 2");

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    if (isRunning) {
      if (playerTurn == 1) {
        intervalRef.current = setInterval(() => {
          setP1Time((prevTime) => prevTime + 10);
          setCurrentP1Turn((prevTime) => prevTime + 10);
        }, 10);
      } else if (playerTurn == 2) {
        intervalRef.current = setInterval(() => {
          setP2Time((prevTime) => prevTime + 10);
          setCurrentP2Turn((prevTime) => prevTime + 10);
        }, 10);
      }
    } else {
      clearInterval(intervalRef.current);
    }
    return () => {
      clearInterval(intervalRef.current);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isRunning, playerTurn, currentP1Turn, currentP2Turn]);

  const handleKeyDown = (event) => {
    if (!showModal) {
      if (event.key === "p") setIsRunning(false);
      if (event.key === " " || event.code === "Space") {
        handleSwap();
      }
    }
  };

  const handleClick = (event) => {
    if (event.target.classList.contains("waitingTimer") || event.target.closest(".waitingTimer")) {
      handleStart();
    } else if (event.target.classList.contains("activeTimer") || event.target.closest(".activeTimer")) {
      handleSwap();
    }
  };

  const handleSwap = () => {
    if (!isRunning) {
      setIsRunning(true);
    }
    // Action to perform on space bar press
    if (isRunning) {
      if (playerTurn == 2) {
        setP2Times([...p2Times, currentP2Turn]);
        setCurrentP1Turn(0);
        setPlayerTurn(1);
      }
      if (playerTurn == 1) {
        setP1Times([...p1Times, currentP1Turn]);
        setCurrentP2Turn(0);
        setPlayerTurn(2);
      }
      setTotalTurns((t) => t + 1);
    }
  };

  const handleStart = () => {
    setIsRunning(true);
  };

  const handleStop = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setP1Time(0);
    setP2Time(0);
    setCurrentP1Turn(0);
    setCurrentP2Turn(0);
    setTotalTurns(0);
    setP1Times([]);
    setP2Times([]);
    setPlayerTurn(1);
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleUpdateP1 = (event) => {
    setP1Name(event.target.value);
  };

  const handleUpdateP2 = (event) => {
    setP2Name(event.target.value);
  };

  const handleChangeActivePlayer = () => {
    if (playerTurn == 1) setPlayerTurn(2);
    else setPlayerTurn(1);
  };

  const calculateLastFewAverage = (arrayOfTurns) => {
    if (arrayOfTurns.length > 0) {
      let timeTaken = 0;
      for (let i = 0; i < arrayOfTurns.length && i <= 4; i++) {
        timeTaken += arrayOfTurns[i];
      }
      if (arrayOfTurns.length >= 5) timeTaken = timeTaken / 5;
      else timeTaken = timeTaken / arrayOfTurns.length;

      return timeTaken;
    }

    return 0;
  };

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    //const milliseconds = ms % 1000;
    //return `${minutes.toString().padStart(2, "0")}m ${seconds.toString().padStart(2, "0")}s ${milliseconds.toString().padStart(3, "0")}`;
    return `${minutes.toString().padStart(2, "0")}m ${seconds.toString().padStart(2, "0")}s`;
  };

  return (
    <Container>
      <Row>
        <h1>General TCG Turn Timer</h1>
        <h3>Turns Elapsed: {totalTurns}</h3>
        <h3>Total Elapsed Match Time: {formatTime(p1Time + p2Time)}</h3>
      </Row>
      <Row className="m-3">
        <Col className={playerTurn % 2 == 1 && isRunning ? "activeTimer" : playerTurn == 1 ? "waitingTimer" : "inactiveTimer"} onClick={handleClick}>
          <h4 className="mt-3">{p1Name}</h4>
          <p>Total: {formatTime(p1Time)}</p>
          <p>Current: {formatTime(currentP1Turn)}</p>
        </Col>
        <Col className={playerTurn % 2 == 0 && isRunning ? "activeTimer" : playerTurn == 2 ? "waitingTimer" : "inactiveTimer"} onClick={handleClick}>
          <h4 className="mt-3">{p2Name}</h4>
          <p>Total: {formatTime(p2Time)}</p>
          <p>Current: {formatTime(currentP2Turn)}</p>
        </Col>
      </Row>
      <Row className="m-3">
        <Row>
          <Col className="mt-3">
            <Button onClick={handleStart} disabled={isRunning} variant="outline-success">
              <i className="bi-caret-right-square"></i>&nbsp;Start
            </Button>
          </Col>
          <Col className="mt-3">
            <Button onClick={handleStop} disabled={!isRunning} variant="outline-secondary">
              <i className="bi-pause-btn"></i>&nbsp;Pause
            </Button>
          </Col>

          <Col className="mt-3">
            <Button onClick={handleReset} disabled={isRunning} variant="outline-warning">
              <i className="bi-arrow-counterclockwise"></i>&nbsp;Reset
            </Button>
          </Col>
          <Col className="mt-3">
            <Button onClick={handleShowModal} disabled={isRunning} variant="outline-info">
              <i className="bi-gear"></i>&nbsp;Settings
            </Button>
          </Col>
        </Row>
      </Row>
      <Row className="m-3">
        <Col>
          <h6>{p1Name} Elapsed Times: </h6>
          {p1Times.length > 0 && (
            <>
              <span>Last 5 turn average: {formatTime(calculateLastFewAverage(p1Times.toReversed()))}</span>
              <ul>
                {p1Times.toReversed().map((t, index) => (
                  <li key={`1.${t}.${index}`}>{formatTime(t)}</li>
                ))}
              </ul>
            </>
          )}
        </Col>
        <Col>
          <h6>{p2Name} Elapsed Times: </h6>
          {p2Times.length > 0 && (
            <>
              <span>Last 5 turn average: {formatTime(calculateLastFewAverage(p2Times.toReversed()))}</span>
              <ul>
                {p2Times.toReversed().map((t, index) => (
                  <li key={`2.${t}.${index}`}>{formatTime(t)}</li>
                ))}
              </ul>
            </>
          )}
        </Col>
      </Row>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Set Player Names</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleCloseModal}>
            <Form.Group>
              <Form.Label>Player 1 Name:</Form.Label>
              <Form.Control type="text" placeholder="Player 1" value={p1Name} onChange={handleUpdateP1}></Form.Control>
              <Form.Check type="radio" label="Player 1 is the active/starting player?" id="rd1" inline checked={playerTurn == 1} onChange={handleChangeActivePlayer}></Form.Check>
            </Form.Group>
            <Form.Group>
              <Form.Label>Player 2 Name:</Form.Label>
              <Form.Control type="text" placeholder="Player 2" value={p2Name} onChange={handleUpdateP2}></Form.Control>
              <Form.Check type="radio" label="Player 2 is the active/starting player?" id="rd1" inline checked={playerTurn == 2} onChange={handleChangeActivePlayer}></Form.Check>
            </Form.Group>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default TurnTimer;
