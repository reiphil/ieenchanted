import React, { useState, useEffect, useRef } from "react";
import { Row, Col, Form, Modal, Button, Alert } from "react-bootstrap";

import { Formik } from "formik";
import * as Yup from "yup";

const AuthLogin = ({ ReturnLogin }) => {
  const [userName, setUserName] = useState(null);
  const [loginType, setLoginType] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submissionError, setSubmissionError] = useState("");

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const formRef = useRef(null);

  const CheckLoginStatus = () => {
    fetch("IEEService/auth/status", {
      mode: "cors",
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((results) => {
        return results.json();
      })
      .then((data) => {
        ReturnLogin(data);
        if (data.user) {
          setUserName(data.user.username);
        }
      });
  };

  useEffect(() => {
    CheckLoginStatus();

    return () => {};
  }, []);

  const performLogout = () => {
    fetch("IEEService/Logout", {
      mode: "cors",
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }).then(() => {
      setUserName(null);
      CheckLoginStatus();
    });
  };

  const handleSubmit = (values, { setSubmitting }) => {
    setSubmitting(true);
    if (loginType) {
      fetch("IEEService/Login", {
        mode: "cors",
        method: "POST",
        credentials: "include",
        body: JSON.stringify(values),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then(() => {
          setSubmitting(false);
          formRef.current.resetForm();
          CheckLoginStatus();
          handleCloseModal();
        })
        .catch((error) => {
          console.log(error);
          setSubmissionError(error.statusText);
        });
    } else {
      fetch("IEEService/Register", {
        mode: "cors",
        method: "POST",
        credentials: "include",
        body: JSON.stringify(values),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then((data) => {
          console.log(data);
          setSubmitting(false);
          handleCloseModal();
          formRef.current.resetForm();
        })
        .catch((error) => {
          console.log(error);
          setSubmitting(false);
          setSubmissionError(error.statusText);
        });
    }
  };

  const formSchema = Yup.object().shape({
    username: Yup.string().required("Required").min(4, "Minimum 4 characters"),
    password: Yup.string()
      .required("Required")
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])(?=.{8,})/, "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"),
  });

  return (
    <>
      {userName ? (
        <>
          <div className="text-center">
            Welcome back, {userName}
            {"  "}
            <Button onClick={performLogout} size="sm">
              Logout
            </Button>
          </div>
        </>
      ) : (
        <Button onClick={handleShowModal} size="sm">
          Contributor Login
        </Button>
      )}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {submissionError.length > 0 && <Alert variant="Danger">Error with login/creation: {submissionError}</Alert>}
          <Form className="mb-3">
            <Form.Check inline label="Login" name="group1" type="Radio" id="r1" checked={loginType} onChange={() => setLoginType(!loginType)}></Form.Check>
            <Form.Check inline label="Register User" name="group1" type="Radio" id="r2" checked={!loginType} onChange={() => setLoginType(!loginType)}></Form.Check>
          </Form>
          {!loginType && <Alert variant="info">Users must still be flagged by Phil to be able to update or create events/stores. Please contact Phil after you create your account.</Alert>}
          <Formik
            initialValues={{
              username: "",
              password: "",
            }}
            onSubmit={handleSubmit}
            innerRef={formRef}
            validationSchema={formSchema}
          >
            {({ values, handleChange, handleBlur, handleSubmit, isSubmitting, errors, touched }) => (
              <Form onSubmit={handleSubmit}>
                <Row className="mb-3">
                  <Col>
                    <Form.Label>Username:</Form.Label> {errors.username && touched.username ? <span className="danger">{errors.username}</span> : null}
                    <Form.Control name="username" onChange={handleChange} onBlur={handleBlur} values={values.username}></Form.Control>
                  </Col>
                  <Col>
                    <Form.Label>Password:</Form.Label> {errors.password && touched.password ? <span className="danger">{errors.password}</span> : null}
                    <Form.Control name="password" onChange={handleChange} onBlur={handleBlur} values={values.password} type="password"></Form.Control>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Button variant="success" disabled={isSubmitting} onClick={!isSubmitting ? handleSubmit : null} type="submit">
                      {loginType ? (isSubmitting ? "Logging In" : "Log In") : isSubmitting ? "Creating User..." : "Create User"}
                    </Button>
                  </Col>
                </Row>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AuthLogin;
