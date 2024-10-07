import React from 'react'
import {VscAccount} from "react-icons/vsc"
import {VscDashboard} from "react-icons/vsc"
import {VscVm} from "react-icons/vsc"
import {VscAdd} from "react-icons/vsc"
import {VscMortarBoard} from "react-icons/vsc"
import {VscHistory} from "react-icons/vsc"
import { useDispatch } from 'react-redux'
import { matchPath, NavLink, useLocation } from 'react-router-dom'
import resetCourseState from '../../../slice/cartSlice'
import { sidebarLinks } from '../../../data/dashboard-links'

function SidebarLink({ link, iconName }) {

    const Icon = iconName
    console.log(Icon)
    const location = useLocation()
    const dispatch = useDispatch()

    const matchRoute = (route) => {
        return matchPath({ path: route }, location.pathname)
    }

    return (
        <NavLink
            to={link.path}
            onClick={() => dispatch(resetCourseState())}
            className={`relative px-8 py-2 text-sm font-medium ${matchRoute(link.path)
                ? "bg-yellow-800 text-yellow-50"
                : "bg-opacity-0 text-richblack-300"
                } transition-all duration-200`}
        >
            <span
                className={`absolute left-0 top-0 h-full w-[0.15rem] bg-yellow-50 ${matchRoute(link.path) ? "opacity-100" : "opacity-0"
                    }`}
            ></span>
            <div>
                <Icon className="text-lg" />
                <span>{link.name}</span>
            </div>
        </NavLink>
    )
}

export default SidebarLink
