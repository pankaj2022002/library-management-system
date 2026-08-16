const express = require('express')
const { users } = require('../data/users.json')
const { books } = require('../data/books.json')

const router = express.Router()

/**
 * Route:/users
 * Method:GET
 * Decsription: get all the list of users in the system
 * Access: public
 * Paramters:none
 */

// Retrieve all users from the system
router.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        data: users
    })
})

/**
 * Route:/users/:id
 * Method:GET
 * Decsription: get a user by their ID
 * Access: public
 * Paramters:id
 */

// Retrieve a specific user by their ID
router.get('/:id', (req, res) => {
    // Extract user ID from request parameters
    const { id } = req.params;

    // Search for user in the users array
    const user = users.find((each) => each.id === id)

    // Return error if user not found
    if (!user) {
        return res.status(404).json({
            success: false,
            message: `user not found id: ${id}`
        })
    }

    res.status(200).json({
        success: true,
        data: user
    })
})

/**
 * Route:/users/
 * Method:POST
 * Decsription: create/register a new user
 * Access: public
 * Paramters:none
 */

// Create a new user in the system
router.post('/', (req, res) => {
    // Extract user data from request body
    const { id, name, surname, email, subscriptionType, subscriptionDate } = req.body;

    // Validate that all required fields are provided
    if (!id || !name || !surname || !subscriptionType || !subscriptionDate) {
        return res.status(400).json({
            success: false,
            message: "please provide all the required"
        })
    }

    // Check if user already exists
    const user = users.find((each) => each.id === id)
    if (user) {
        return res.status(404).json({
            success: false,
            message: `user Already exist id:${id}`
        })
    }

    // Add new user to users array
    users.push({ id, name, email, surname, subscriptionType, subscriptionDate })
    res.status(201).json({
        success: true,
        message: "user create Successfully"
    })

})

/**
 

* Route:/users/:id
 * Method:PUT
 * Decsription: update an existing user by their ID
 * Access: public
 * Paramters:id
 */

// Update an existing user by their ID
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { data } = req.body;
    // Check if the user exists
    const user = users.find((each) => each.id == id)
    if (!user) {
        return res.status(404).json({
            success: false,
            message: `user not found for id: ${id}`
        })
    }
    // Map through users and update the matching user with new data
    const updateUser = users.map((each) => {
        if (each.id == id) {
            return {
                ...each,
                ...data,
            }
        }
        return each
    })
    res.status(200).json({
        success: true,
        data: updateUser,
        message: "user update successfully"
    })
})

/**
 * Route:/users/:id
 * Method:DELETE
 * Decsription: delete an existing user by their ID
 * Access: public
 * Paramters:id
 */

// Delete a user by their ID
router.delete('/:id', (req, res) => {
    const { id } = req.params;

    // Check if the user exists
    const user = users.find((each) => each.id === id)
    if (!user) {
        return res.status(404).json({
            success: false,
            message: `user not found for id:${id}`
        })
    }
    // If user exists, filter it out from the users array
    const updateUser = users.filter((each) => each.id != id)
    res.status(200).json({
        success: true,
        data: updateUser,
        message: "user deleted successfully"
    })
})

/**
 * Route:/users/subscription-detail/:id
 * Method:
 * Decsription: get all the subscription details of user by thier id
 * Access: public
 * Paramters:id
 */

router.get('/subscription-details/:id', (req, res) => {
    const { id } = req.params;

    const user = users.find((each) => each.id == id);
    if (!user) {
        return res.status(404).json({
            success: false,
            message: `user not found for id:{id}`
        })
    }

    const getDateInDays = (data = '') => {
        let date;
        if (data) {
            date = new Date(data);
        } else {
            date = new Date()
        }
        let days = Math.floor(date / (1000 * 60 * 60 * 24));
        return days;
    }

    const subscriptionType = (date) => {
        if (user.subscriptionType === "basic") {
            date = date + 90;
        } else if (user.subscriptionType == "standard") {
            date = date + 180
        } else if (user.subscriptionType === "premium") {
            date = date + 365;
        }
        return date;
    }

    let returnDate = getDateInDays(user.returnDate);
    let currentDate = getDateInDays();
    let subscriptionDate = getDateInDays(user.subscriptionDate)
    let subscriptionExpiration = subscriptionType(subscriptionDate);

    const data = {
        ...user,
        subscriptionExpirated: subscriptionExpiration < currentDate,
        subscriptionDaysLeft: subscriptionExpiration - currentDate,
        daysLeftExpirattion: returnDate - currentDate,
        returnDate: returnDate < currentDate ? "Book is overdue" : returnDate,
        fine: returnDate < currentDate ? subscriptionExpiration <= currentDate ? 200 : 100 : 0
    }

    res.status(200).json({
        success: true,
        data: data
    })




})

module.exports = router