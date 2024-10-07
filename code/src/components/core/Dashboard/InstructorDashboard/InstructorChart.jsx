import { Chart, registerables } from 'chart.js'
import React from 'react'
import { Pie } from 'react-chartjs-2'


Chart.register(...registerables)

function InstructorChart({ courses }) {

    const [currChart, setCurrChart] = useState("students")

    const generateRandomColors = (numColors) => {
        const colors = []
        for (let i = 0; i < numColors; i++) {
            const color = `rgb(${Math.floor(Math.random() * 256)},
            ${Math.floor(Math.random() * 256)},
            ${Math.floor(Math.random() * 256)})`
            colors.push(color)
        }
        return colors
    }

    const chartDataStudents = {
        labels: courses.map((course) => course.courseName),
        datasets:[
            {
                data: courses.map((course) => course.totalStudentsEnrolled),
                backgroundColor: generateRandomColors(courses.length)
            },
        ],
    }

    const chartIncomeData = {
        labels: courses.map((course) => course.courseName),
        datasets: [
            {
                data: courses.map((course) => course.totalAmountGenerated),
                backgroundColor: generateRandomColors(courses.length)
            },
        ],
    }

    const options = {
        maintainAspectRatio: false,
    }

    return (
        <div className='flex flex-1 flex-col gap-y-4 rounded-md bg-richblack-800 p-6'>
            <p className='text-lg font-bold text-richblack-5'>Visualize</p>
            <div>
                <button
                    onClick={() => setCurrChart("students")}
                    className={`rounded-md p-1 px-3 transition-all duration-200 
                    ${currChart === "students" ? "bg-richblack-700" : "text-yellow-400"}`}
                >
                    Students
                </button>

                <button
                    onClick={() => setCurrChart("income")}
                    className={`rounded-sm p-1 px-3 transition-all duration-200 ${currChart === "income"
                        ? "bg-richblack-700 text-yellow-50"
                        : "text-yellow-400"
                        }`}
                >
                    Income
                </button>
            </div>
            <div className='relative mx-auto aspect-square h-full w-full'>
                <Pie
                    data={currChart === "students" ? chartDataStudents : chartIncomeData}
                    options={options}
                />
            </div>
        </div>
    )
}

export default InstructorChart