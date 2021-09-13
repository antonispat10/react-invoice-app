import { Navbar, Nav, Button } from 'react-bootstrap';
import { ShLink } from './shared';

export default function Header() {

  return (
    <Navbar bg="light" expand="lg">
        <Navbar.Brand>Invoice App</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
            <Nav
            className="mr-auto my-2 my-lg-0"
            style={{ maxHeight: '100px' }}
            >
                <ShLink href="/">Invoices</ShLink>
                <ShLink href="/customers">Customers</ShLink>
            </Nav>
        </Navbar.Collapse>
    </Navbar>
  )
}