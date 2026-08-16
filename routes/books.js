const   express = require('express');

// Import data from JSON files
const { books } = require('../data/books.json');
const {users} =require('../data/users.json')

//  Create an instance of the Express router
const router = express.Router();

/**
 * Route: /books
 * Method: GET
 * description: Get all the list of books in the system
 * Access: public
 * Parameters: none
 */
router.get('/',(req,res)=>{
    res.status(200).json({
        success:true,
        data:books
    })
})


/**
 * router:/books
 * Method:GET
 * description:get any books from books list
 * Access:public
 * Parameters:id
 */
router.get('/:id',(req,res)=>{

    const {id}=req.params;

    const book=books.find((each)=>each.id===id)
    if(!book){
        return res.status(404).json({
            success:false,
            message:`book is not found:${id}`
        })
    }

    res.status(200).json({
        success:true,
        data:book
    })
})

/**
 * Route:/books
 * Method:POST
 * Decsription: create/register a new book
 * Access: public
 * Paramters:none
 */

router.post('/',(req,res)=>{
   
 
    const {id,name,author,genre,price,publisher}=req.body;

    if(!id || !name || !author || !price || !genre || !publisher){
        return res.status(400).json({
            success:false,
            message:"Please provide all information"
        })
    }

    const book=books.find((each)=>each.id===id)
    if(book){
        return res.status(400).json({
            success:false,
            message:`id:${id} is already exists`
        })
    }
    books.push({id,name,author,genre,price,publisher})
    res.status(201).json({
        success:true,
        message:"user create successfully"
    })
})

/**
 * Route:/books
 * Method:PUT
 * Decsription: update an existing book by thier ID
 * Access: public
 * Paramters:Id
 */

router.put('/:id',(req,res)=>{
    const {id}=req.params;

    const {data}=req.body;

    const book=books.find((each)=>each.id===id)
    if(!book){
        return res.status(404).json({
            success:false,
            message:`id:${id} not exist`
        })
    }
    const updatebook=books.map((each)=>{
        if(each.id===id){
            return{
                ...each,
                ...data,
            }

        }
        return each
    })
    res.status(200).json({
        success:true,
        data:updatebook,
        message:"book update successfully"
    })
})

/**
 * Route:/users/:id
 * Method:DELETE
 * Decsription: delete an existing book by their ID
 * Access: public
 * Paramters:id
 */
router.delete('/:id',(req,res)=>{
    const {id}=req.params

    const book=books.find((each)=>each.id===id)
    if(!book){
        return res.status(404).json({
            success:false,
            message:`book not found for id:${id}`
        })
    }
    const updateBook=books.filter((each=>each.id!==id))
    res.status(200).json({
        success:true,
        data:updateBook,
        message:"book deleted successfully"
    })
})


/**
 * Route:/users/issued
 * Method:get
 * Decsription: get all issued book
 * Access: public
 * Paramters:none
 * 
 */
router.get('/issued/for-users',(req,res)=>{

    const usersWithIsIssuedBooks=users.filter((each)=>{
        if(each.issuedBook){
            return each;
        }
    })
    const issuedBooks=[];
    
    usersWithIsIssuedBooks.forEach((each)=>{
        const book=books.find((book)=>book.id===each.issuedBook);

        book.issuedBy=each.name;
        book.issuedDate=each.issuedDate;
        book.returnDate=each.returnDate;

        issuedBooks.push(book)
    })
    if(issuedBooks=== 0){
        return res.status(404).json({
            success:false,
            message:"no book issued yet"
        })
    }
    res.status(200).json({
        success:true,
        data:issuedBooks
    })
})

module.exports = router;