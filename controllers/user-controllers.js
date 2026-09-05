const {BookModel, UserModel}=require("../models")

exports.getAllUsers=async (req,res)=>{
    const users=await UserModel.find()

    if(!users || users.length===0){
        return res.status(404).json({
            success:false,
            message:"no user found"
        })

    }
    res.status(200).json({
        success:true,
        data:users
    })
}

exports.getSingleUserById = async(req,res)=>{
    const {id} =req.params;


    const user = await UserModel.findById(id);

    if(!user){
        return res.status(404).json({
            success:false,
            message:"user not found"
        })
    }
    res.status(200).json({
        success:true,
        message:user
    });
}

exports.createUser = async(req,res)=>{
    const {data} =  req.body;

    if(!data || Object.keys(data).length===0){
        return res.status(400).json({
            success:false,
            message:"please provide the data to create a new user"
        })
    }
    await UserModel.create(data)
    const getAllUsers= await UserModel.find()

    res.status(201).json({
        success:true,
        message:"user created successfully",
        data:getAllUsers
    })
}

exports.updateUserById = async(req,res)=>{
    const {id} = req.params;
    const {data}=req.body;

    if(!data || Object.keys(data).length===0){
        return res.status(400).json({
            success:false,
            message:"please provide the data to update user"
        })

    }
    const user=await UserModel.findById(id);
    if(!user){
        return res.status(404).json({
            success:false,
            message:`user not found for id: ${id}`
        })
    }
    const  updateUser =await UserModel.findByIdAndUpdate(id,data,{new:true})

    res.status(200).json({
        success:true,
        data:updateUser,
        message:"user updated successfully"
    })
}

exports.deleteUserById = async (req, res) => {
    const { id } = req.params;

    
    const deletedUser = await UserModel.findByIdAndDelete(id);

    
    if (!deletedUser) {
        return res.status(404).json({
            success: false,
            message: `user not found for id: ${id}`
        });
    }

    return res.status(200).json({
        success: true,
        message: "user deleted successfully" 
    });
};


exports.getSubscriptionDetailsByID = async (req, res) => {
    const { id } = req.params;

    const user = await UserModel.findById(id);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: `user not found for id: ${id}` // FIXED: Typo 'if' to 'id'
        });
    }

    // Helper function to turn a date string into absolute days
    const getDataInDays = (data = '') => {
        let date;
        if (data) {
            date = new Date(data);
        } else {
            date = new Date();
        }
        let days = Math.floor(date / (1000 * 60 * 60 * 24));
        return days;
    };

    // Calculate subscription length based on type
    const subscriptionType = (date) => {
        if (user.subscriptionType === "Basic") {
            date = date + 90;
        } else if (user.subscriptionType === "standard") { // Note: Kept standard check clean
            date = date + 365; // FIXED: Changed typo 'data' to 'date'
        }
        return date;
    };

    // FIXED: Adjusted function calls from 'getDateInDays' to 'getDataInDays'
    let returnDate = getDataInDays(user.returnDate);
    let currentDate = getDataInDays();
    let subscriptionDate = getDataInDays(user.subscriptionDate);
    let subscriptionExpiration = subscriptionType(subscriptionDate);

    // FIXED: Spread 'user._doc' instead of raw 'user' to cleanly extract schema data
    const data = {
        ...user._doc, 
        subscriptionExpired: subscriptionExpiration < currentDate, // Fixed spelling
        subscriptionDaysLeft: subscriptionExpiration - currentDate,
        daysLeftExpiration: returnDate - currentDate, // Fixed spelling
        returnDate: returnDate < currentDate ? "Book is overdue" : user.returnDate,
        fine: returnDate < currentDate ? (subscriptionExpiration <= currentDate ? 200 : 100) : 0
    };

    return res.status(200).json({
        success: true,
        data: data
    });
};
