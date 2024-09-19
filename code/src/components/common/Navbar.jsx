import React, { useEffect, useState } from 'react'
import { NavbarLinks } from '../../data/navbar-links'
import { Link, matchPath, useLocation } from 'react-router-dom'
import logo from '../../assets/Logo/Logo-Full-Light.png'
import { useSelector } from 'react-redux'
import { AiOutlineShoppingCart } from 'react-icons/ai'
import ProfileDrowpdown from '../core/Auth/ProfileDrowpdown'
import { apiConnector } from '../../services/apiconnector'
import { categories } from '../../services/api'
import { BsChevronDown } from 'react-icons/bs'

// for temporary testing


function Navbar() {
 
    const { token } = useSelector(state => state.auth)
    const { user } = useSelector(state => state.profile)
    const { totalItems } = useSelector(state => state.cart)

    const [subLinks, setSubLinks] = useState([])
    const [loading,setLoading] = useState(true)

    const fetchSubLinks = async () => {
        try {
            const result = await apiConnector("GET", categories.CATEGORIES_API)
            setSubLinks(result.data.data)
            setLoading(false)
        } catch (err) {
            console.log("Could not fetch the category list")
        }
    }

    useEffect(() => {
        fetchSubLinks();
    }, [])

    const location = useLocation();
    const matchRoute = (route) => {
        return matchPath({ path: route }, location.pathname);
    }

    return (
        <div className='flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700'>
            <div className='flex w-11/12 max-w-maxContent items-center justify-between mx-auto'>
                {/* Logo */}
                <Link to={"/"}>
                    <img src={logo} width={150} height={42} loading='lazy' />
                </Link>

                {/* Nav links */}
                <nav>
                    <ul className='flex gap-x-4 text-richblack-25'>
                        {
                            NavbarLinks.map((ele, i) => {
                                return (
                                    <li key={i}>
                                        {
                                            ele.title === "Catalog" ?
                                                (<>
                                                    <div className='group flex justify-center items-center gap-1 cursor-pointer relative'>
                                                        <p>{ele.title}</p>
                                                        <BsChevronDown />

                                                        <div className="invisible absolute left-[50%] top-[80%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all
                                                         duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]">

                                                            <div className='absolute left-[50%] top-0 translate-x-[80%] translate-y-[-45%] h-6 w-6 rotate-45 rounded bg-richblack-5'></div>
                                                            {loading ? (
                                                                <p className="text-center">Loading...</p>
                                                            ) : (subLinks && subLinks.length) ? (
                                                                <>
                                                                    {subLinks
                                                                        ?.filter(
                                                                            (subLink) => subLink?.courses?.length > 0
                                                                        )
                                                                        ?.map((subLink, i) => (
                                                                            <Link
                                                                                to={`/catalog/${subLink.name
                                                                                    .split(" ")
                                                                                    .join("-")
                                                                                    .toLowerCase()}`}
                                                                                className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50"
                                                                                key={i}
                                                                            >
                                                                                <p>{subLink.name}</p>
                                                                            </Link>
                                                                        ))}
                                                                </>
                                                            ) : (
                                                                <p className="text-center">No Courses Found</p>
                                                            )}

                                                        </div>

                                                    </div>
                                                </>) : (<>
                                                    <Link to={ele?.path}><p className={`${matchRoute(ele?.path) ? "text-yellow-25" : "text-richblack-25"}`}>{ele.title}</p></Link>
                                                </>)
                                        }
                                    </li>
                                )
                            })
                        }
                    </ul>
                </nav>

                {/* login/signup/dashboard */}
                <div className='flex gap-x-4 items-center'>
                    {
                        user && user?.accountType != "Instructor" && (
                            <Link to={"/dashboard/cart"} className='relative'>
                                <AiOutlineShoppingCart className='text-2xl text-richblack-100'></AiOutlineShoppingCart>
                                {
                                    totalItems > 0 && (
                                        <span className="absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold text-yellow-100">
                                            {totalItems}
                                        </span>
                                    )
                                }
                            </Link>
                        )
                    }
                    {token === null && (
                        <Link to="/login">
                            <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                                Log in
                            </button>
                        </Link>
                    )}
                    {token === null && (
                        <Link to="/signup">
                            <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                                Sign up
                            </button>
                        </Link>
                    )}
                    {token !== null && (
                        <ProfileDrowpdown />
                    )}
                </div>


            </div>
        </div>
    )
}

export default Navbar