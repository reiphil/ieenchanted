import React, { Component } from "react";
import { Container } from "react-bootstrap";
import MainAppWrapper from "./MainAppWrapper";

export class Home extends Component {
  static displayName = Home.name;

  render() {
    return (
      <Container>
        <MainAppWrapper />
      </Container>
    );
  }
}
