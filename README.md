# library-management-system

    this is a library management API Backend for the management of user and book

## Routes and the Endpoints 

## /users
 
 GET:get all the list of users in the system
 POST: create/register a new user

 ## /users/(id)

 GET:get a users  by thier ID
 PUT:updating  a user by thier ID
 DELETE : Delecting a user by thier ID(if the user still an issued book ) &&  (is there any fine/pwnalty to be collected)

## /users/subscription-details/(id)

    GET:get a user subscription detials by thier ID
        >> Date of subscription 
        >> Valid till
        >> Fine if any


## /books
GET: get all the books in the system
POST: add a new book to the system

## /books/(id)
GET: get a book by its ID
PUT: Update a book by its ID
DELETE: delete a book by its ID

## /books/issued
GET:get all the issued books

## /books/issues/withFine
GET:get all issued books with thier fine amount

### Subscrition Types

        >>BASIC(3months)
        >>Standerd(6months)
        >>Premium(12 months)

>> if a user missed the renewal date, ther user should be collected with $100
>> if a user missed his subscription, then user is expected to pay $100
>> if a user missed both renewal & subscription ,then the  collected amount should be  $100

## command
npm init
npm i express
npm i nodemon --save-dev

npm run dev