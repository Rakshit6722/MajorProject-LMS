import React, { useState } from 'react'
import { HomePageExplore } from '../../../data/homepage-explore';
import HighlightText from './HighlightText';
import CourseCard from './CourseCard';

const tabsName = [
    "Free",
    "New to Coding",
    "Most popular",
    "Skill paths",
    "Career paths"
]

function ExploreMore() {
    const [currentTab, setCurrentTab] = useState(tabsName[0]);
    const [courses, setCourses] = useState(HomePageExplore[0].courses)
    const [currentCard, setCurrentCard] = useState(HomePageExplore[0].courses[0].heading)
    const setMyCards = (value) => {
        setCurrentTab(value);
        const result = HomePageExplore.filter(course => course.tag === value)
        setCourses(result[0].courses)
        setCurrentCard(result[0].courses[0].heading)
    }
    return (
        <div>
            <div className='text-4xl font-semibold text-center'>
                Unlock the
                <HighlightText text={"Power of Code"} />
            </div>
            <p className='text-center text-richblack-300 text-[16px] mt-2'>
                Learn to build anything you can imagine
            </p>

            <div className='flex flex-row rounded-full bg-richblack-800 mb-5 mt-5 border-richblack-300 px-1 py-1'>
                {
                    tabsName.map((ele,i)=>{
                        return(
                            <div key={i}
                             className={`text-[16px]
                             ${currentTab===ele?"bg-richblack-900 text-richblack-5 font-medium":"text-richblack-200"}
                             rounded-full duration-200 transition-all cursor-pointer hover:bg-richblue-900 hover:text-richblack-5 px-5 py-3`} 
                             onClick={()=>setMyCards(ele)}
                             >
                              {ele}  
                            </div>
                        )
                    })
                }
            </div>

            <div className='lg:h-[150px]'>
                <div  className="lg:absolute gap-10 justify-center lg:gap-0 flex lg:justify-between flex-wrap w-full lg:bottom-[0] lg:left-[50%] lg:translate-x-[-50%] lg:translate-y-[50%] text-black lg:mb-0 mb-7 lg:px-0 px-3">
                    {
                        courses.map((ele,i)=>{
                            return(
                                <CourseCard
                                key={i}
                                cardData={ele}
                                currentCard={currentCard}
                                setCurrentCard={setCurrentCard}
                                />
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default ExploreMore