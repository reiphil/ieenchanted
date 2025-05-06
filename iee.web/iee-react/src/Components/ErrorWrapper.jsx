import React from "react";

import { Alert } from "react-bootstrap";

const ErrorWrapper = ({ ShowError, Message }) => {
  return (
    <>
      {ShowError && (
        <Alert variant="danger">
          {Message} <img alt="" src={require("../icons/fixit.png")} width="45" height="45" className="d-inline-block" />
        </Alert>
      )}
    </>
  );
};

export default ErrorWrapper;
