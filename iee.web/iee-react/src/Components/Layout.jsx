import React, { Component } from "react";
import { Container } from "react-bootstrap";

export class Layout extends Component {
  static displayName = Layout.name;

  render() {
    return (
      <div>
        <Container>{this.props.children}</Container>
      </div>
    );
  }
}
