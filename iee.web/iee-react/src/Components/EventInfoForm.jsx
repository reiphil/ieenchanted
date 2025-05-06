import React, { useState, useEffect, useRef } from "react";
import { Formik } from "formik";
import TimePicker from "react-bootstrap-time-picker";

import * as Yup from "yup";

import { Container, Row, Col, Form, Button } from "react-bootstrap";

const EventInfoForm = ({ EventId, Stores, ReloadEvents, CloseModal }) => {
  const [eventId, setEventId] = useState(0);
  const [eventInfo, setEventInfo] = useState({ eventType: "Weekly", dayOfWeek: -1, timeOfEvent: 32400, dateOfEvent: "", meleeUrl: "", signUpUrl: "", cost: "", notes: "", title: "", storeId: 0 });
  const [stores, setStores] = useState([]);
  const formRef = useRef();

  const resetForm = () => {
    formRef.current.resetForm();
  };

  const convertTimeStampToSecs = (time) => {
    if (isNaN(time)) {
      let hms = time.split(":");
      return Number(hms[0]) * 3600 + Number(hms[1]) * 60 + Number(hms[2]);
    }
    return time;
  };

  const deleteEvent = async () => {
    if (window.confirm("Deletions are not reversible, are you sure?")) {
      fetch(`IEEService/DeleteEvent/?eventId=${EventId}`, {
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
          console.log(data);
          ReloadEvents();
          CloseModal();
        });
    }
  };

  useEffect(() => {
    if (Stores && Stores.length > 0) {
      setStores(Stores);
    } else {
      fetch("IEEService/GetStores/", {
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
          setStores(data.data);
        });
    }
    if (EventId > 0) {
      fetch(`IEEService/GetEventInfo/?eventId=${EventId}`, {
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
          setEventId(EventId);
          setEventInfo({
            storeId: data.data.storeId,
            eventType: data.data.eventType,
            dayOfWeek: data.data.dayOfWeek,
            timeOfEvent: data.data.timeOfEvent,
            dateOfEvent: data.data.dateOfEvent ? data.data.dateOfEvent : "",
            meleeUrl: data.data.meleeUrl,
            signUpUrl: data.data.signUpUrl,
            cost: data.data.cost,
            notes: data.data.notes,
            title: data.data.title,
          });
        });
    }
    return () => {};
  }, [EventId]);

  const handleSubmit = (values, { setSubmitting }) => {
    setSubmitting(true);

    let eventInfo = {
      eventId: eventId,
      storeId: values.storeId,
      eventType: values.eventType,
      dayOfWeek: values.dayOfWeek,
      timeOfEvent: convertTimeStampToSecs(values.timeOfEvent),
      dateOfEvent: values.dateOfEvent,
      meleeUrl: values.meleeUrl,
      signUpUrl: values.signUpUrl,
      cost: values.cost,
      notes: values.notes,
      title: values.title,
    };

    fetch("IEEService/UpdateEventInfo", {
      mode: "cors",
      method: "POST",
      credentials: "include",
      body: JSON.stringify(eventInfo),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }).then((data) => {
      ReloadEvents();
      setSubmitting(false);
      if (CloseModal) CloseModal();
      formRef.current.resetForm();
      return data.json();
    });
  };

  const StoreSchema = Yup.object().shape({
    storeId: Yup.number().min(1, "Please select a store"),
  });

  return (
    <Container fluid="md">
      <Row>
        <Formik
          initialValues={{
            eventType: eventInfo.eventType,
            dayOfWeek: eventInfo.dayOfWeek,
            timeOfEvent: eventInfo.timeOfEvent,
            dateOfEvent: eventInfo.dateOfEvent,
            meleeUrl: eventInfo.meleeUrl,
            signUpUrl: eventInfo.signUpUrl,
            cost: eventInfo.cost,
            title: eventInfo.title,
            notes: eventInfo.notes,
            storeId: eventInfo.storeId,
          }}
          onSubmit={handleSubmit}
          innerRef={formRef}
          validationSchema={StoreSchema}
          enableReinitialize
        >
          {({ values, handleChange, handleBlur, handleSubmit, isSubmitting, dirty, errors, touched, setFieldValue }) => (
            <Form onSubmit={handleSubmit}>
              <Row className="mb-2">
                <Col>
                  <Form.Label>Store</Form.Label> {errors.storeId && touched.storeId ? <span className="danger">{errors.storeId}</span> : null}
                  <Form.Select name="storeId" onChange={handleChange} onBlur={handleBlur} value={values.storeId}>
                    <option value={0} key="0">
                      --Select Store--
                    </option>
                    {stores.map((s) => (
                      <option value={s.storeInfo.id} key={s.storeInfo.id}>
                        {s.storeInfo.storename}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
                <Col>
                  <Form.Label>Event Type</Form.Label>
                  <Form.Select name="eventType" onChange={handleChange} onBlur={handleBlur} value={values.eventType}>
                    <option>Weekly</option>
                    <option>Big Event</option>
                    <option>Set Champ</option>
                  </Form.Select>
                </Col>
              </Row>
              {values.eventType == "Weekly" ? (
                <Row className="mb-2">
                  <Col>
                    <Form.Label>Day of Week</Form.Label>
                    <Form.Select name="dayOfWeek" onChange={handleChange} onBlur={handleBlur} value={values.dayOfWeek}>
                      <option value={-1}>Select a Day</option>
                      <option value={0}>Sunday</option>
                      <option value={1}>Monday</option>
                      <option value={2}>Tuesday</option>
                      <option value={3}>Wednesday</option>
                      <option value={4}>Thursday</option>
                      <option value={5}>Friday</option>
                      <option value={6}>Saturday</option>
                    </Form.Select>
                  </Col>
                  <Col>
                    <Form.Label>Start Time</Form.Label>
                    <TimePicker
                      start="09:00"
                      end="23:00"
                      step={15}
                      name="timeOfEvent"
                      onChange={(value) => setFieldValue("timeOfEvent", value)}
                      onBlur={handleBlur}
                      value={values.timeOfEvent}
                    ></TimePicker>
                  </Col>
                  <Col>
                    <Form.Label>Cost</Form.Label>
                    <Form.Control name="cost" onChange={handleChange} onBlur={handleBlur} value={values.cost} size="sm"></Form.Control>
                  </Col>
                </Row>
              ) : (
                <>
                  <Row className="mb-2">
                    <Col>
                      <Form.Label>Event Date</Form.Label>
                      <Form.Control type="date" name="dateOfEvent" value={values.dateOfEvent} onChange={handleChange} onBlur={handleBlur}></Form.Control>
                    </Col>
                    <Col>
                      <Form.Label>Start Time</Form.Label>
                      <TimePicker
                        start="09:00"
                        end="23:00"
                        step={15}
                        name="timeOfEvent"
                        onChange={(value) => setFieldValue("timeOfEvent", value)}
                        onBlur={handleBlur}
                        value={values.timeOfEvent}
                      ></TimePicker>
                    </Col>
                    <Col>
                      <Form.Label>Cost</Form.Label>
                      <Form.Control name="cost" onChange={handleChange} onBlur={handleBlur} value={values.cost} size="sm"></Form.Control>
                    </Col>
                  </Row>
                  {values.eventType == "Big Event" && (
                    <Row className="mb-2">
                      <Col>
                        <Form.Label>Event Title</Form.Label>
                        <Form.Control name="title" onChange={handleChange} onBlur={handleBlur} value={values.title}></Form.Control>
                      </Col>
                    </Row>
                  )}
                  <Row className="mb-2">
                    <Col>
                      <Form.Label>Melee URL</Form.Label>
                      <Form.Control name="meleeUrl" onChange={handleChange} onBlur={handleBlur} value={values.meleeUrl}></Form.Control>
                    </Col>
                    <Col>
                      <Form.Label>Alternate Sign Up URL</Form.Label>
                      <Form.Control name="signUpUrl" onChange={handleChange} onBlur={handleBlur} value={values.signUpUrl}></Form.Control>
                    </Col>
                  </Row>
                </>
              )}

              <Row className="mb-2">
                <Col>
                  <Form.Label>Notes</Form.Label>
                  <Form.Control as="textarea" name="notes" onChange={handleChange} onBlur={handleBlur} value={values.notes}></Form.Control>
                </Col>
              </Row>
              <Row>
                <Col className="d-grid gap-2">
                  <Button variant="success" disabled={isSubmitting} onClick={!isSubmitting ? handleSubmit : null} type="submit">
                    {" "}
                    {isSubmitting ? "Saving..." : "Save"}
                  </Button>
                </Col>
                <Col className="d-grid gap-2">
                  <Button variant="info" disabled={!dirty} onClick={resetForm}>
                    Reset
                  </Button>
                </Col>
                <Col className="d-grid gap-2">
                  <Button variant="danger" disabled={eventId == 0} onClick={deleteEvent}>
                    Delete
                  </Button>
                </Col>
              </Row>
            </Form>
          )}
        </Formik>
      </Row>
    </Container>
  );
};

export default EventInfoForm;
