const express=require('express')

const app=express()

const port=8001

app.get('/',(req,res)=>{
    res.status(200).json({
        massage:"Home page"
    })
})

// app.all(/.*/, (req, res) => {
//     res.status(500).json({
//         message: "NOT built yet"
//     });
// });

app.listen(port,()=>{
    console.log(`server run on port http://localhost:${port}`)
})