// library imports
import { useContext, useState } from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavbarText,
} from 'reactstrap';
import { useCookies } from 'react-cookie';
import { Link } from 'react-router-dom';
import axios from 'axios';

// context import
import UserContext from '../../context/UserContext';

// CSS imports
import './Header.css';
import CartContext from '../../context/CartContext';

function Header(props) {
  const [isOpen, setIsOpen] = useState(false);
  const {user, setUser} = useContext(UserContext);
  const {cart, setCart} = useContext(CartContext);

  const toggle = () => setIsOpen(!isOpen);
  const [token, setToken, removeToken] = useCookies(['jwt-token']);

  function logout(){
    removeToken("jwt-token", {httpOnly: true});
    axios.get(`${import.meta.env.VITE_FAKE_STORE_URL}/logout`, {withCredentials: true});
    setUser(null);
    setCart(null);
  }

  return (
    <div className='Navbar'>
      <Navbar {...props}>
        <NavbarBrand id='title'>
          <Link to="/" >Shop Cart</Link>
        </NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="ms-auto" navbar>
            <NavItem>
            </NavItem>
            <UncontrolledDropdown nav inNavbar style={{marginRight:"2rem"}}>
              <DropdownToggle nav caret id='options'>
                Options
              </DropdownToggle>
              <DropdownMenu right>

                { user && <DropdownItem> <Link to={`/cart/${user.id}`}>Cart {cart && cart.products && `(${cart.products.length})`}</Link></DropdownItem> }

                <DropdownItem>Settings</DropdownItem>
                <DropdownItem divider />
                <DropdownItem>
                  {token['jwt-token'] ? 
                    <Link onClick={() => {
                      logout();
                    }
                  } to='/signin'>LogOut</Link> : <Link to='/signin'>SignIn</Link>}
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
            {user && <NavbarText id='username'>{user.username}</NavbarText>}
          </Nav>
          
        </Collapse>
      </Navbar>
    </div>
  );
}

export default Header;