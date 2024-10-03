const Category = require('../model/CategoryDetails')

function getRandomInt(max) {
    return Math.floor(Math.random() * max)
}

//create CategoryDetails handler function
exports.createCategoryDetails = async (req, res) => {
    try {
        //fetch data
        const { name, description } = req.body

        //validate
        if (!name) {
            return res.json(401).json({
                success: false,
                message: "Enter valid details while creating CategoryDetails"
            })
        }

        const CategoryDetails = await Category.findOne({ name })
        if (CategoryDetails) {
            return res.status(401).json({
                success: false,
                message: "CategoryDetails already exits"
            })
        }

        //entry in db
        const newCategoryDetails = await CategoryDetails.create({ name, description })
        console.log(newCategoryDetails)
        return res.status(200).json({
            success: true,
            message: "CategoryDetails creation successfull"
        })



    } catch (err) {
        console.log("Error in CategoryDetails creation ", err)
        res.status(500).json({
            success: false,
            message: "Error in CategoryDetails creation"
        })
    }
}

exports.showAllCategoryDetails = async (req, res) => {
    try {
        const allCategoryDetails = await Category.find({}, { name: true, description: true })

        console.log(allCategoryDetails)

        res.status(200).json({
            success: true,
            data: allCategoryDetails,
            message: "All CategoryDetails fetched successfully",

        })

    } catch (err) {
        console.log("Error in fetching CategoryDetails ", err)
        return res.status(500).json({
            success: false,
            message: `Error while fetching all CategoryDetails, ${err.message}`
        })
    }
}

exports.categoryPageDetails = async (req, res) => {
    try {
        const { categoryId } = req.body
        console.log("Printing CATEFORY ID...", categoryId)

        const selectedCategory = await Category.findById(categoryId)
            .populate({
                path: 'courses',
                match: { status: "Published" },
                populate: "ratingAndReviews,"
            })
            .exec()

        if (!selectedCategory) {
            console.log("Category not found")
            return res.status(404).json({
                success: false,
                message: "Category not found."
            })
        }

        if (selectedCategory.courses.length === 0) {
            console.log("No courses found for the selected category.")
            return res.status(404).json({
                success: false,
                message: "No courses found for the selected category."
            })
        }

        const categoriesExceptSelected = await Category.find({
            _id: { $ne: categoryId },
        })

        let differentCategory = await Category.findOne(
            categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]._id
        ).populate({
            path: 'courses',
            match: { status: "Published" }
        })
            .exec()

        const allCategories = Category.find()
            .populate({
                path: "courses",
                match: { status: "Published" },
                populate: {
                    path: "instructor",
                }
            })
            .exec()

        //flatMap will return a single array that will contain all category courses array in one array
        const allCourses = allCategories.flatMap(category => category.courses)

        const mostSellingCourses = allCourses.sort((a, b) => b.sold - a.sold).slice(0, 10)

        res.status(200).json({
            success: true,
            data: {
                selectedCategory,
                differentCategory,
                mostSellingCourses,
            },
        })

    } catch (err) {
        console.log('Category Page Details Error...')
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            err: err.message
        })
    }
}