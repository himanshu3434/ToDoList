//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose=require("mongoose");

const lodash=require("lodash");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));



mongoose.connect("mongodb+srv://himanshu_y34:"+encodeURIComponent('chekssle#$4352')+"@cluster1.bmlcaic.mongodb.net/todolistDB");
//creating schema

const itemschema={name:String};
//creating a model

const Item=mongoose.model("Item",itemschema);

const item1=new Item({
  name:"here is first"
});
const  item2=new Item({
  name:"here is second"
});

const item3=new Item({
  name:"here is third"
});

const defaultItems=[item1,item2,item3];

const listSchema={
  name:String,
  items:[itemschema]
};

const List=mongoose.model("List",listSchema);





app.get("/", function(req, res) {

  Item.find(function(err,founditems){

    if(founditems.length===0)
    {
     

      Item.insertMany(defaultItems,function(err)
{
  if(err)
  {
    console.log(err);
  }
  else
  {
    console.log("there is not error !Success");
  }
});
     res.redirect("/");
    }
   

    else{
      res.render("list", {listTitle:"Today", newListItems: founditems});
    }

   
  });

 

});

app.post("/", function(req, res){

  const itemname = req.body.newItem;
  const listName=req.body.list;
  const item4=new Item({
    name:itemname
  });
  if(listName==="Today")
  {
    item4.save();
  res.redirect("/");
  }
  else
  {
    List.findOne({name:listName},function(err,foundList){
     foundList.items.push(item4);
      foundList.save(function(){
        res.redirect("/"+listName);
      });
      
    });
  }

  // if (req.body.list === "Work") {
  //   workItems.push(item);
  //   res.redirect("/work");
  // } else {
  //   items.push(item);
  //   res.redirect("/");
  // }
});

app.post("/delete",function(req,res){
    const checkeditemid=req.body.checkbox;
    const listName=req.body.listName;
    
    if(listName==="Today")
    {
      Item.findByIdAndRemove(checkeditemid,function(err){
        if(!err)
        {
         res.redirect("/");
        }
        else
        {
          console.log(err);
        }
      });
    }
    else
    { 
      List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkeditemid}}},function(err,foundList){
        if(!err)
        {   
          res.redirect("/"+listName);
        }
      });
    }
   
});

app.get("/:customListName",function(req,res){
  const customListName=lodash.capitalize(req.params.customListName);


  List.findOne({name:customListName},function(err,foundList){
     if(!err){
      if(!foundList){
      //create new list
      const list=new List({
        name:customListName,
        items:defaultItems
      });
      list.save(
        function(){
          res.redirect("/"+customListName);
        }
      );
      
      }
      else
      { 
       
         res.render("list",{listTitle:
            foundList.name,newListItems:foundList.items
         });
      }
     }
  });


  
});

app.get("/about", function(req, res){ 
  res.render("about");
});

app.listen(process.env.PORT||3000, function() {
  console.log("Server started ");
});
