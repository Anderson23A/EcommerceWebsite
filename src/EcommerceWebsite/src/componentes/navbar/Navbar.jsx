import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import LogoIMG from '../../assets/Logo.png'
import './Navbar.scss'

export default function MainNavbar() {
    return (
        <Navbar expand='lg'>
            <Container>
                <Navbar.Brand href='/'>
                    <img src={LogoIMG} alt="" />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls='basic-navbar-nav'>
                    <div className='icon'>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                </Navbar.Toggle>
                <Navbar.Collapse id='basic-navbar-nav'>
                    <Nav className='ms-auto'>
                        <Nav.Link href='/'>Home</Nav.Link>
                        <Nav.Link href='#'>Item</Nav.Link>
                        <Nav.Link href='#'>Item</Nav.Link>
                        <Nav.Link href='#'>Item</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}