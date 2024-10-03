import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet, useParams } from 'react-router-dom'
import VideoDetailsSidebar from '../components/core/viewCourse/VideoDetailsSidebar'
import CourseReviewModal from '../components/core/viewCourse/CourseReviewModal'
import { getFullDetailsOfCourse } from '../services/operations/courseDetailsAPI'
import { setCompletedLectures, setCourseEntireData, setCourseSectionData, setTotalNoOfLectures } from '../slice/viewCourseSlice'

function ViewCourse() {

  const { courseId } = useParams()
  const { token } = useSelector(state => state.auth)
  const dispatch = useDispatch()
  const [reviewModel, setReviewModel] = useState(false)

  useEffect(() => {
    (async () => {
      const courseData = await getFullDetailsOfCourse(courseId, token)
      dispatch(setCourseEntireData(courseData.courseDetails))
      dispatch(setCourseSectionData(courseData.courseDetails.courseContent))
      dispatch(setCompletedLectures(courseData.completedVideos))
      let lectures = 0
      courseData?.courseDetails?.courseContent?.forEach((sec) => {
        lectures += sec.subSection.length
      })
      dispatch(setTotalNoOfLectures(lectures))
    })()
  }, [])

  return (
    <>

      <div className="relative flex min-h-[calc(100vh-3.5rem)]">
        <VideoDetailsSidebar setReviewModal={setReviewModel} />
        <div className="h-[calc(100vh-3.5rem)] flex-1 overflow-auto">
          <div className='mx-6'>
            <Outlet />
          </div>
        </div>
      </div>
      {reviewModel && <CourseReviewModal setReviewModal={setReviewModel} />}

    </>

  )
}

export default ViewCourse