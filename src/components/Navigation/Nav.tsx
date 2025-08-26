import './Nav.scss'
import { NavLink } from 'react-router-dom';

function Nav() {
    return (
        <div className="topnav">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/news">News</NavLink>
            <NavLink to="/contact">Contact</NavLink>
            <NavLink to="/about">About</NavLink>
        </div>
    );
}

export default Nav;