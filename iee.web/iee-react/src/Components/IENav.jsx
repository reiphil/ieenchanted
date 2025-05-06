import React, { useState } from "react";

import { Navbar, NavbarBrand, NavItem, Container, Button, Modal, Offcanvas, Nav } from "react-bootstrap";

const IENav = () => {
  const [showModal, setShowModal] = useState(false);
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  return (
    <>
      <Navbar expand="sm" className="bg-body-tertiary">
        <Container fluid>
          <NavbarBrand>
            <img alt="" src={require("../icons/iee-orange-small.png")} width="30" height="30" className="d-inline-block align-top" />
            {"  "}Inland Empire Enchanted{" "}
          </NavbarBrand>
          <Navbar.Toggle aria-controls="offcanvasNav" />
          <Navbar.Offcanvas aria-labelledby="offcanvasNav" id="offcanvasNav" placement="end">
            <Offcanvas.Header closeButton>
              <Offcanvas.Title>Menu</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="justify-content-end flex-grow-1 pe-3">
                <NavItem>
                  <Button variant="link" onClick={handleShowModal}>
                    About/Disclaimer/Support
                  </Button>
                </NavItem>
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Thank you for visiting!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h3>About us!</h3>
          <p>
            The IE Enchanted came about shortly after the release of Lorcana when it was hard to find information about where to play and what stores were offering. We started from a small google
            spreadsheet that tracked Inland Empire stores to a large community of 500+ players, 70+ stores, and 100+ weekly events.
          </p>
          <p>
            The information we get is crowd sourced and is reported for players by players. We gather store weeklies and large events and categorize them so players can find the next big event for
            Lorcana or sharpen their skills any day of the week.
          </p>
          <p>Huge thanks to the following contributors:</p>
          <ul>
            <li>DarkSydeBrian</li>
            <li>Beedee5</li>
            <li>Shenney</li>
          </ul>
          <p>
            If you are interested in joining our community or contributing, please come visit us on{" "}
            <a href="https://discord.com/invite/sRwTx63Azr" target="_blank" rel="noreferrer">
              Discord!
            </a>
          </p>
          <h3>Disclaimer!</h3>
          <p>
            Some Social Media Icons designed by{" "}
            <a href="www.freepik.com" target="_blank" rel="noreferrer">
              Freepik
            </a>
            .
          </p>
          <p>
            Art/Trademarks from Disney Lorcana TCG is used under the{" "}
            <a href="https://cdn.ravensburger.com/lorcana/community-code-en" target="_blank" rel="noreferrer">
              Ravensburger Community Code Policy.
            </a>
          </p>
          <h3>Support us!</h3>
          <p>
            The best support you can give the IE-Enchanted is just spreading the word and helping connect and build our Lorcana community.
            <br />
            Our discord is an amazing community and you can also connect with me on various social platforms: <br />
            <a href="https://discord.com/invite/sRwTx63Azr" target="_blank" rel="noreferrer">
              <img alt="" src={require("../icons/discord.png")} width="40" height="40" className="d-inline-block align-top m-2" />
            </a>
            <a href="https://bsky.app/profile/iee-phil.bsky.social" target="_blank" rel="noreferrer">
              <img alt="" src={require("../icons/bluesky.jpg")} width="40" height="40" className="d-inline-block align-top m-2" />
            </a>
            <a href="https://www.instagram.com/iee_phil/" target="_blank" rel="noreferrer">
              <img alt="" src={require("../icons/instagram.png")} width="40" height="40" className="d-inline-block align-top m-2" />
            </a>
            <a href="https://x.com/iee_phil" target="_blank" rel="noreferrer">
              <img alt="" src={require("../icons/twitter.png")} width="40" height="40" className="d-inline-block align-top m-2" />
            </a>
          </p>
          <p>
            If you&apos;d like to help with server costs, please feel free to browse my TCG Player or Buy me a Coffee using any of the links below!
            <br />
            <a href="https://buymeacoffee.com/ieenchanted" target="_blank" rel="noreferrer">
              <img alt="" src={require("../icons/buymeacoffee.png")} width="40" height="40" className="d-inline-block align-top m-2" />
            </a>
            <a href="https://shop.tcgplayer.com/sellerfeedback/63045dc6" target="_blank" rel="noreferrer">
              <img alt="" src={require("../icons/tcgplayer.png")} width="40" height="40" className="d-inline-block align-top m-2" />
            </a>
          </p>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default IENav;
