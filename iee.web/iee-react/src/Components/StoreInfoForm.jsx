import React, { useState, useEffect, useRef } from "react";
import { Formik, FieldArray } from "formik";
import * as Yup from "yup";
import ErrorWrapper from "./ErrorWrapper";

import { Container, Row, Col, Form, Button } from "react-bootstrap";

const StoreInfoForm = ({ StoreId, CloseModal, ReloadStores }) => {
  const [storeId, setStoreId] = useState(0);
  const [storeInfo, setStoreInfo] = useState({ Address: "", Phone: "", Region: "IE", City: "", Storename: "", Latitude: "", Longitude: "", Notes: "", URLS: [] });
  const formRef = useRef();

  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const resetForm = () => {
    formRef.current.resetForm();
  };

  const deleteStore = () => {
    if (window.confirm("Deletions are not reversible, are you sure?")) {
      fetch(`IEEService/DeleteStore/?storeId=${StoreId}`, {
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
          setShowError(false);
          ReloadStores();
          CloseModal();
        })
        .catch(() => {
          setShowError(true);
          setErrorMessage("An error occurred trying to delete a store.");
        });
    }
  };

  useEffect(() => {
    if (StoreId > 0) {
      fetch(`IEEService/GetStoreInfo/?storeId=${StoreId}`, {
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
          setStoreId(StoreId);
          setStoreInfo({
            Address: data.storeInfo.storeInfo.address,
            Phone: data.storeInfo.storeInfo.phone,
            Region: data.storeInfo.storeInfo.region,
            Storename: data.storeInfo.storeInfo.storename,
            Latitude: data.storeInfo.storeInfo.latitude,
            Longitude: data.storeInfo.storeInfo.longitude,
            Notes: data.storeInfo.storeInfo.notes ? data.storeInfo.storeInfo.notes : "",
            URLS: data.storeInfo.urls,
          });
          console.log(data.storeInfo);
        });
    }
    return () => {};
  }, [StoreId]);

  const handleSubmit = (values, { setSubmitting }) => {
    setSubmitting(true);

    const storeLat = values.LatLong.length > 0 ? values.LatLong.split(", ")[0] : "";
    const storeLong = values.LatLong.length > 0 ? values.LatLong.split(", ")[1] : "";

    let storeInfo = {
      Id: storeId,
      City: "",
      Address: values.Address,
      Region: values.Region,
      Storename: values.Storename,
      Phone: values.Phone,
      Latitude: storeLat,
      Longitude: storeLong,
      Notes: values.Notes,
    };

    let postModel = {
      storeInfo: storeInfo,
      URLS: values.URLS,
    };

    fetch("IEEService/UpdateStoreInfo", {
      mode: "cors",
      method: "POST",
      credentials: "include",
      body: JSON.stringify(postModel),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }).then((data) => {
      setSubmitting(false);
      if (CloseModal) CloseModal();
      formRef.current.resetForm();
      ReloadStores();
      return data.json();
    });
  };

  const StoreSchema = Yup.object().shape({
    Address: Yup.string().required("Required"),
    Storename: Yup.string().required("Required"),
    Phone: Yup.string().required("Required"),
  });

  return (
    <Container fluid="md">
      <Row>
        <ErrorWrapper ShowError={showError} Message={errorMessage} />
        <Formik
          initialValues={{
            Address: storeInfo.Address,
            Phone: storeInfo.Phone,
            Storename: storeInfo.Storename,
            Region: storeInfo.Region,
            LatLong: storeInfo.Latitude ? storeInfo.Latitude + ", " + storeInfo.Longitude : "",
            Notes: storeInfo.Notes,
            URLS: storeInfo.URLS,
          }}
          onSubmit={handleSubmit}
          innerRef={formRef}
          validationSchema={StoreSchema}
          enableReinitialize
        >
          {({ values, handleChange, handleBlur, handleSubmit, isSubmitting, dirty, errors, touched }) => (
            <Form onSubmit={handleSubmit}>
              <Row className="mb-2">
                <Col>
                  <Form.Label>Store Name</Form.Label> {errors.Storename && touched.Storename ? <span className="danger">{errors.Storename}</span> : null}
                  <Form.Control name="Storename" onChange={handleChange} onBlur={handleBlur} value={values.Storename}></Form.Control>
                </Col>
                <Col>
                  <Form.Label>Address</Form.Label> {errors.Address && touched.Address ? <span className="danger">{errors.Address}</span> : null}
                  <Form.Control name="Address" onChange={handleChange} onBlur={handleBlur} value={values.Address}></Form.Control>
                </Col>
              </Row>
              <Row className="mb-2">
                <Col>
                  <Form.Label>Phone</Form.Label> {errors.Phone && touched.Phone ? <span className="danger">{errors.Phone}</span> : null}
                  <Form.Control name="Phone" onChange={handleChange} onBlur={handleBlur} value={values.Phone}></Form.Control>
                </Col>
                <Col>
                  <Form.Label>Region</Form.Label>
                  <Form.Select name="Region" onChange={handleChange} onBlur={handleBlur} value={values.Region}>
                    <option>IE</option>
                    <option>LA</option>
                    <option>OC</option>
                    <option>High Desert</option>
                    <option>Ventura</option>
                    <option>SD</option>
                  </Form.Select>
                </Col>
              </Row>
              <Row className="mb-2">
                <Col>
                  <Form.Label>Latitude & Longitude</Form.Label>
                  <Form.Control name="LatLong" onChange={handleChange} onBlur={handleBlur} value={values.LatLong}></Form.Control>
                </Col>
              </Row>
              <Row className="mb-2">
                <Col>
                  <Form.Label>Notes</Form.Label>
                  <Form.Control as="textarea" name="Notes" onChange={handleChange} onBlur={handleBlur} value={values.Notes}></Form.Control>
                </Col>
              </Row>
              <Row>
                <Form.Label>Store URLs</Form.Label>
                <FieldArray
                  name="URLS"
                  render={(arrayHelpers) => (
                    <Row className="mb-2">
                      {values.URLS && values.URLS.length > 0 ? (
                        <>
                          {values.URLS.map((url, index) => (
                            <Row key={index} className="mb-2">
                              <Col sm>
                                <Form.Control name={`URLS.${index}`} onChange={handleChange} onBlur={handleBlur} value={values.URLS[index]} />
                              </Col>
                              <Col xs lg="1">
                                <Button variant="danger" onClick={() => arrayHelpers.remove(index)}>
                                  -
                                </Button>
                              </Col>
                            </Row>
                          ))}
                          <Col className="d-grid gap-3 mx-5">
                            <Button size="sm" onClick={() => arrayHelpers.push("")}>
                              +
                            </Button>
                          </Col>
                        </>
                      ) : (
                        <Col className="d-grid gap-3 mx-5">
                          <Button size="sm" onClick={() => arrayHelpers.push("")}>
                            +
                          </Button>
                        </Col>
                      )}
                    </Row>
                  )}
                />
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
                  <Button variant="danger" disabled={storeId == 0} onClick={deleteStore}>
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

export default StoreInfoForm;
