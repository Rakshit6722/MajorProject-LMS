import React from 'react'

function Tab({ tabData, field, setField }) {
    return (
        <div>
            {
                tabData.map((tab) => {
                    return (
                        <button
                            key={tab.id}
                            onClick={(e) => {
                                e.preventDefault()
                                setField(tab.type)
                            }
                            }
                            className={`${field === tab.type
                                ? "bg-richblack-900 text-richblack-5"
                                : "bg-transparent text-richblack-200"
                                } py-2 px-5 rounded-full transition-all duration-200`}
                        >
                            {tab?.tabName}
                        </button>
                    )
                })
            }
        </div>
    )
}

export default Tab