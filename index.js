const express=require('express');
const app=express();
const mongoose =require('mongoose');
const bankSchema =require('./model/bankModel');


//import body parser
let bodyParser = require('body-parser');

//configure bodyparser to hande the post requests
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json());


mongoose.connect('mongodb://localhost:27017/fyle',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify:false,
        useCreateIndex:true
    })
    .then(() => {
        console.log("DB Connected");
    })
    .catch((err) => {
        console.log("OH NO ERROR!!!");
        console.log(err);
    });



app.get('/api/branches/autocomplete', async(req,res)=>{

    try{
        const branchInput = req.query.q;
        const offsetInput = req.query.offset;
        const limitInput = req.query.limit;
        var lim = Number(limitInput);
        var off = Number(offsetInput);
        const branches = await bankSchema.find({},{"branch":branchInput}).select({_id:0,ifsc:1,bank_id:1,address:1,city:1,district:1,state:1})
        .skip(off).limit(lim).sort({ifsc:1});
        const branchData = JSON.stringify({branches});
        res.send(branchData);
    }
    catch (e) 
    {
        console.log("Something Went Wrong");
        res.send('error');
     }
})

//Start Server
app.listen(3000,(req,res)=>{
    console.log("Server running at port 3000");
})