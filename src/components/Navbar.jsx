import React from 'react'
import { NavLink } from 'react-router-dom'

function Navbar() {
    return (
        <div className="navbar">
            <div className="container row">
                <NavLink activeStyle={{ fontWeight: 'bold' }} to="/" exact>হোম</NavLink>
                <NavLink activeStyle={{ fontWeight: 'bold' }} to="/calculate">ক্যালকুলেট</NavLink>
                <NavLink activeStyle={{ fontWeight: 'bold' }} to="/portfolio">পোর্টফোলিও</NavLink>
                <NavLink activeStyle={{ fontWeight: 'bold' }} to="/about">আমার সম্পর্কে</NavLink>
                <NavLink activeStyle={{ fontWeight: 'bold' }} to="/contact">যোগাযোগ</NavLink>
            </div>
        </div>
    )
}

export default Navbar
