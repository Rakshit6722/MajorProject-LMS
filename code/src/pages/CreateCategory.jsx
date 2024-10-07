import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import IconBtn from '../components/common/IconBtn'
import { createCategory } from '../services/operations/courseDetailsAPI'

function CreateCategory() {

    const { token } = useSelector(state => state.auth)
    const { register, handleSubmit, formState: { errors } } = useForm()
    const [loading, setLoading] = useState(false)

    const onSubmit = async (data) => {
        setLoading(true)
        try {
            await createCategory(data, token)
        } catch (err) {
            console.log("Error in creating category", err)
            toast.error("Category Creation Failed")
        }
        setLoading(false)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <div className="bg-richblack-800 p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-semibold text-yellow-50 mb-6 text-center">Create Category</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Category Name */}
                    <div>
                        <label htmlFor="name" className="text-white block text-sm text-gray-300 mb-1">
                        <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                            Category Name:<sup className="text-pink-200">*</sup>
                        </p>
                        </label>
                        <input
                            id="name"
                            className="form-style w-full p-2 text-white bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            type="text"
                            placeholder="Category name..."
                            {...register("name", { required: true })}
                        />
                        {errors.name && (
                            <span className="text-sm text-red-500">Category Name Required</span>
                        )}
                    </div>

                    {/* Category Description */}
                    <div>
                        <label htmlFor="description" className="text-white block text-sm text-gray-300 mb-1">Description:</label>
                        <input
                            id="description"
                            className="form-style w-full p-2 text-white bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            type="text"
                            placeholder="Category description..."
                            {...register("description")}
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-center">
                        <IconBtn
                            type="submit"
                            text="Create Category"
                            disabled={loading}
                            customClasses="w-fit py-2 text-black bg-yellow-200 hover:bg-yellow-500 rounded-lg transition duration-200 ease-in-out transform hover:scale-105"
                        />
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreateCategory
