let express = require("express");
let app = express();

// Mongo Database
let mongoose = require("mongoose");
mongoose.connect('mongodb://localhost/restaurantsSchema');
let RestaurantSchema = new mongoose.Schema({
    name: { type: String, required: true, minlength:[3, 'name must be at least 3 characters']},
    cuisine: { type: String, required: true, minlength:[3, 'cuisine must be at least 3 characters']},
    reviews: { type: []},
    out: {type: Boolean, required: true, default: true},
    editable: {type: Boolean, required: true, default: false}
}, {timestamps: {createdAt: 'created_at'}});
let ReviewSchema = new mongoose.Schema({
    name: { type: String, require: true, minlength: [3, 'name must be at least 3 characters']},
    stars: {type: String, requrired: true},
    review: {type: String, required: true, minlength: [3, 'review must be at least 3 characters']}
})
mongoose.model("Restaurant", RestaurantSchema);
let Restaurant = mongoose.model("Restaurant")
mongoose.model("Review", ReviewSchema);
let Review = mongoose.model("Review");

const path = require("path");

let bodyParser = require("body-parser");    
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//static folder
app.use(express.static(__dirname + '/public/dist'));

//routes

app.get("/restaurants", (req, res, next) => {
    console.log("no restaurants inside");
    Restaurant.find({}, (err, restaurants)=>{
        return res.json(restaurants);
    })
})
app.post("/restaurant", (req, res, next) => {
    console.log("Server > POST '/restaurants' > restaurants ", req.body);
    delete req.body._id
    Restaurant.findOne({name:req.body.name}, (err,pest)=>{
        console.log(pest);
        if (pest) {console.log("this is the problem", pest); return res.json("Already exists")}
        else{
            Restaurant.create(req.body, (err,restaurant)=>{
                if (err) return res.json(err)
                else return res.json(restaurant)
            })
        };
    })
    
})
app.post("/review", (req, res, next)=>{
    console.log("Server> post review", req.body)
    delete req.body._id
    Review.create(req.body, (err, review)=>{
        if (err) return res.json(err)
        else return res.json(review)
    })
    
})
app.delete("/restaurants/:id", (req,res, next)=>{
    console.log(" server > delete id", req.params.id);
    console.log("it's deleltleteing");
    Restaurant.deleteOne({_id:req.params.id}, (err, data)=>{
        if (err) return res.json(err)
        else return res.json(true)
    })
    
})
//edit
app.get("/restaurant/:id",(req,res,next)=>{
    console.log("no Restaurants insijiide");
    Restaurant.findOne({ _id:req.params.id}, (err,restaurant)=>{
        if (err) return res.json(err)
        else return res.json(restaurant)
    })
    // res.sendFile(path.resolve("./public/src/app/pet/pet-update-page/pet-update-page.component.html"))
})
app.put("/restaurant/:id", (req, res, next)=>{
    console.log("server> put ", req.params.id);
    Restaurant.update({_id:req.params.id},req.body,{runValidators: true},(err, rawData)=>{
        if (err) return res.json(err)
        else return res.json(true)
    })
})


app.all("*",(req,res,next) =>{
    res.sendFile(path.resolve("./public/dist/index.html"))
})

app.listen(1337, ()=> console.log("server running at 1337"));