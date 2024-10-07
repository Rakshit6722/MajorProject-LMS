import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import Error from './Error'
import CourseSlider from '../components/core/Catalog/CourseSlider'
import Course_Card from '../components/core/Catalog/Course_Card'
import Footer from '../components/common/Footer'
import { apiConnector } from '../services/apiconnector'
import { categories } from '../services/api'
import { getCatalogPageData } from '../services/operations/pageAndComponentData'

function Catalog() {

    const { loading } = useSelector(state => state.profile)
    const { catalogName } = useParams()
    const [active, setActive] = useState(1)
    const [catalogPageData, setCatalogPageData] = useState(null)
    const [categoryId, setCategoryId] = useState("")

    useEffect(() => {
        const getCategories = async () => {
            const response = await apiConnector(
                "GET",
                categories.CATEGORIES_API
            )
            console.log("res1: ",response);
            const category_Id = response?.data?.data?.filter((ct) => ct.name.split(" ").join("-").toLowerCase() === catalogName)[0]._id
            setCategoryId(category_Id)
        }
        getCategories()
    }, [catalogName])

    useEffect(() => {
        const getCategoryDetails = async () => {
            try {
                const res = await getCatalogPageData(categoryId)
                console.log("res: ", res)
                setCatalogPageData(res)
            } catch (err) {
                console.log(err)
            }

        }
        if (categoryId) {
            getCategoryDetails()
        }
    }, [categoryId])

    if (loading || !catalogPageData) {
        return (
            <div className='grid min-h-[calc(100vh-3.5rem)] place-items-center'>
                <div className='spinner'></div>
            </div>
        )
    }

    return (
        <>
            <div className='mx-auto box-content w-full max-w-maxContent px-4 py-12 lg:max-w-maxContent'>
                <div className='section_heading'>
                    Courses to get you started
                </div>
                <div className='my-4 flex border-b border-b-richblack-600 text-sm'>
                    <p
                        className={`px-4 py-2 ${active === 1
                            ? "border-b border-b-yellow-25 text-yellow-25"
                            : "text-richblack-50"
                            } cursor-pointer`}
                        onClick={() => setActive(1)}
                    >
                        Most Popular
                    </p>
                    <p
                        className={`px-4 py-2 ${active === 2
                            ? "border-b border-b-yellow-25 text-yellow-25"
                            : "text-richblack-50"
                            } cursor-pointer`}
                        onClick={() => setActive(2)}
                    >
                        New
                    </p>
                </div>
                <div>
                    <CourseSlider Courses={catalogPageData?.data?.selectedCategory?.courses} />
                </div>

                <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent" >
                    <div className='section_heading'>
                        Top Courses in {catalogPageData?.data?.differentCategory?.name}
                    </div>
                    <div className='py-8'>
                        <CourseSlider Courses={catalogPageData?.data?.differentCategory?.courses} />
                    </div>
                </div>

                <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
                    <div className='section_heading'>Frequently Bought</div>
                    <div className='py-8'>
                        {catalogPageData?.data?.mostSellingCourses?.slice(0, 4).map((course, i) => (
                            <Course_Card course={course} key={i} Height={"h-[400px]"} />
                        ))}
                    </div>
                </div>
            </div>

            <Footer />
        </>
    )
}

export default Catalog