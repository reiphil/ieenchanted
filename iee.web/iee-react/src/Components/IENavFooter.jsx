import React from "react";
import AuthLogin from "./AuthLogin";

import { Navbar, Container, NavItem } from "react-bootstrap";

const IENavFooter = ({ ReturnLogin }) => {
  return (
    <>
      <Navbar className="bg-body-tertiary">
        <Container>
          <NavItem>
            <AuthLogin ReturnLogin={ReturnLogin} />
          </NavItem>
          <NavItem className="justify-content-end">
            <a href="https://discord.com/invite/sRwTx63Azr" target="_blank" rel="noreferrer">
              <img alt="" src={require("../icons/discord.png")} width="30" height="30" className="d-inline-block align-top m-1" />
            </a>
            <a href="https://bsky.app/profile/iee-phil.bsky.social" target="_blank" rel="noreferrer">
              <img alt="" src={require("../icons/bluesky.jpg")} width="30" height="30" className="d-inline-block align-top m-1" />
            </a>
            <a href="https://www.instagram.com/iee_phil/" target="_blank" rel="noreferrer">
              <img alt="" src={require("../icons/instagram.png")} width="30" height="30" className="d-inline-block align-top m-1" />
            </a>
            <a href="https://buymeacoffee.com/ieenchanted" target="_blank" rel="noreferrer">
              <img alt="" src={require("../icons/buymeacoffee.png")} width="30" height="30" className="d-inline-block align-top m-1" />
            </a>
            <a href="https://shop.tcgplayer.com/sellerfeedback/63045dc6" target="_blank" rel="noreferrer">
              <img alt="" src={require("../icons/tcgplayer.png")} width="30" height="30" className="d-inline-block align-top m-1" />
            </a>
            <a href="https://x.com/iee_phil" target="_blank" rel="noreferrer">
              <img alt="" src={require("../icons/twitter.png")} width="30" height="30" className="d-inline-block align-top m-1" />
            </a>
          </NavItem>
        </Container>
      </Navbar>
    </>
  );
};

export default IENavFooter;
