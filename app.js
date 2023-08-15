//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
// const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");

const app = express();
mongoose.connect("mongodb+srv://rashedayad2000:ras782000@cluster0.h3rhfpm.mongodb.net/todolistDB" , {useNewUrlParser : true});

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const itemsSchema = new mongoose.Schema({
  name : String
});

const listSchema = new mongoose.Schema({
  name : String ,
  items : [itemsSchema]
});

const Item = mongoose.model("item" , itemsSchema);

const List = mongoose.model("list" , listSchema);


const douc1= new Item({
  name:"buy food"
});
const douc2= new Item({
  name:"cook food"
});
const douc3= new Item({
  name:"eat food"
});
var defulatItems= [douc1 , douc2 ,douc3];




// const items = ["Buy Food", "Cook Food", "Eat Food"];
// const workItems = [];



app.get("/", function(req, res) {

// const day = date.getDate();

  Item.find().then(function (items){
    if (items.length === 0 ){
      Item.insertMany(defulatItems).then(function(){
        console.log("seccess")
      }).catch(function (err){
        console.log(err);
      });
      res.redirect("/");
    }else{
      res.render("list", {listTitle: "Today", newListItems: items});
    }
  });

});

app.post("/", function(req, res){

  const newItem = req.body.newItem;
  const listNameTitle = req.body.list ;
  const listNameTitleS = listNameTitle.toLowerCase() ;
  const item = new Item({
    name : newItem
  });

  if(listNameTitle ==="Today" ){
    item.save();
    res.redirect("/");
  }else {
    List.findOne({name : listNameTitleS}).then(function (document){
      document.items.push(item);
      document.save();
      res.redirect("/" + listNameTitleS);
    }).catch(function (err){
      console.log(err);
    })
  }

});


app.post("/delete" , function(req , res){
  const itemCheckBoxId = req.body.checkbox ;
  const listName = req.body.listName.toLowerCase() ;
  // console.log(itemCheckBoxId);
  if(listName === "today"){
    Item.deleteOne({_id : itemCheckBoxId}).then(function (){
      console.log("seccess");
    }).catch(function (err){
      console.log(err);
    });
    res.redirect("/");
  }else{
    List.findOneAndUpdate({name : listName} , {$pull :{items : {_id : itemCheckBoxId}}}).then(function (doc){
      res.redirect("/" + listName);
    }).catch(function (err){
      console.log(err);
    });
  }


  // other way
  // Item.findByIdAndRemove(itemCheckBoxId).then(function (){
  //   console.log("seccess");
  // }).catch(function (err){
  //   console.log(err);
  // });;
});


app.get("/:newList" , function (req , res){
  const newList =  req.params.newList ;
  const smallString = newList.toLowerCase() ;

  List.findOne({name : smallString}).then(function (document){
    if(!document){
      console.log(smallString);
      const newListData = new List({
        name : smallString ,
        items : defulatItems
      });
      newListData.save();
      res.redirect("/" + smallString);
    }else {
      res.render("list", {listTitle: smallString.slice(0,1).toUpperCase() + smallString.slice(1).toLowerCase() , newListItems : document.items});
    }
  }).catch(function (err){
    console.log(err);
  });


});


// app.get("/work", function(req,res){
//   res.render("list", {listTitle: "Work List", newListItems: workItems});
// });

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(process.env.port || 3000, function() {
  console.log("Server started on port 3000");
});
