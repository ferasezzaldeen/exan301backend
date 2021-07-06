const express = require('express') // require the express package
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const server = express() // initialize your express app instance
const PORT = process.env.PORT
server.use(express.json());
server.use(cors())

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_ATLAS, { useNewUrlParser: true, useUnifiedTopology: true });



const CocktailSchema = new mongoose.Schema({
    name: String,
    url: String,
});


const Cocktailuser = mongoose.model('cocktail', CocktailSchema);



server.listen(PORT, () => console.log('listening on PORT', PORT))




server.get('/getalldata', getalldata)
server.post('/addtofav',addtofav)
server.get('/getfavdata',getfavdata)
server.delete('/deletedats',deletedats)
server.put('/updatedata',updatedata)

function getalldata(req, res) {
    let url = 'https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Non_Alcoholic';
    const data = axios.get(url).then(data => {
        res.send(data.data.drinks)
    })
}

function addtofav(req,res){
    const name=req.query.name;
    const url=req.query.url;

    const item=new Cocktailuser({
        name:name,
        url:url,
    })
    item.save()
}   

function getfavdata(req,res){
    Cocktailuser.find({},(err,data)=>{
        res.send(data)
    })
}


function deletedats(req,res){
    const id= req.query.id;
    console.log(id);
    Cocktailuser.deleteOne({_id:id},(err,data)=>{
        Cocktailuser.find({},(err,data)=>{
            res.send(data)
        })
    })
}

function updatedata(req,res){
    const id= req.query.id;
    const name=req.query.name;
    const url=req.query.url;
    Cocktailuser.find({_id:id},(err,data)=>{
        data[0].name=name;
        data[0].url=url;
        data[0].save().then(()=>{
            Cocktailuser.find({},(err,data)=>{
                res.send(data)
            })
        })
    })
}