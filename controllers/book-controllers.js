const {BookModel,UserModel}= require('../models')
const IssuedBook=require("../dtos/book-dtos")


exports.getAllBooks= async (req,res)=>{
    const books = await BookModel.find()

    if (books.length==0){
        return res.status(404).json({
            success:false,
            message:"no books in the system"
        })
    }
    res.status(200).json({
        success:true,
        data:books
    })
}


exports.getSingleBookById=async(req,res)=>{
    const {id}= req.params;

    const book= await BookModel.findById(id) 
     
    if(!book){
        return res.status(404).json({
            success:false,
            message:"book is not found"
        })
    }
    res.status(200).json({
        success:true,
        message:book
    })
}

exports.getAllIssuedBooks=async(req,res)=>{
    const users = await UserModel.find({
        issuedBook:{$exists:true},
    }).populate("issuedBook")

    const issuedBooks=users.map((each)=>{
        return new IssuedBook(each);

    })
    if(issuedBooks.length===0){
        return res.status(404).json({
            success:false,
            message:"no books issued yet"
        })
    }
    res.status(200).json({
        success:true,
        data:issuedBooks
    })
}


exports.addNewBook = async (req, res) => {
    const { data } = req.body;

    // 1. Check if data exists and is not an empty object
    if (!data || Object.keys(data).length === 0) {
        return res.status(400).json({
            success: false,
            message: "please provide the data to add a new book"
        });
    }

    // 2. Database logic runs out here (after the if block passes)
    await BookModel.create(data);
    
    const allBooks = await BookModel.find();
    
    return res.status(201).json({
        success: true,
        message: "book added successfully",
        data: allBooks
    });
};


exports.updateBookById=async(req,res)=>{
    const {id} =req.params;
    const{data}= req.body;

    if(!data || Object.keys(data).length===0){
        return res.status(404).json({
            success:false,
            message:"please provide the data to update"
        })
    }

    const updateBook =await BookModel.findOneAndUpdate(
        {_id:id},
        data,
        {new:true}
    )
     if(!updateBook){
        return res.status(400).json({
            success:false,
            message:`book not found for id: ${id}`
        })
     }
     res.status(200).json({
        success:true,
        message:"book updated successfully",
        data:updateBook
     })
}

exports.deleteBookById=async(req,res)=>{
    const {id}=req.params;

    const book =await BookModel.findById(id);

    if(!book){
        return res.status(404).json({
            success:false,
            message:`book not found by id: ${id}`
        })
    }

    await BookModel.findByIdAndDelete(id);
    res.status(200).json({
        success:true,
        message:"book delected successfully"
    })
}