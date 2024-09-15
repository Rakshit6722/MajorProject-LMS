const Category =  require('../model/Category')

//create category handler function
exports.createCategory = async (req,res) => {
    try{
        //fetch data
        const{name,description} = req.body
    
        //validate
        if(!name || !description) {
            return res.json(401).json({
                success:false,
                message:"Enter valid details while creating category"
            })
        }

        const Category = await Category.findOne({name})
        if(findTag){
            return res.status(401).json({
                success:false,
                message:"Category already exits"
            })
        }

        //entry in db
        const newCategory = await Category.create({name,description})

        return res.status(200).json({
            success:true,
            message:"Category creation successfull"
        })

        
        
    }catch(err){
        console.log("Error in category creation ",err)
        res.status(500).json({
            success:false,
            message:"Error in category creation"
        })
    }
}
 
exports.showAllCategory = async (req,res) => {
    try{
        const allCategory =await Category.find({},{name:true,description:true})

        console.log(allCategory)

        res.status(200).json({
            success:true,
            message:"All category fetched successfully",
            allTag
        })

    }catch(err){
        console.log("Error in fetching category ",err)
        return res.status(500).json({
            success:true,
            message:"Error while fetching all category"
        })        
    }
}