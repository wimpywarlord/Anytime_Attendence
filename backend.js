var bodyParser = require('body-parser');
var mongoose =require("mongoose");
var express= require("express");
var app = express();

mongoose.connect("mongodb://localhost/kshitij");

var viit_att_schema = new mongoose.Schema({
	name : String,
	no_of_present: Number,
	no_of_absent: Number
});

app.use(bodyParser.urlencoded({extended:true}));

var viit_att= mongoose.model("viit_att",viit_att_schema);

var list_of_all_members;

viit_att.find({},function(err,viit_atts)
{
	if (err) {
		console.log("OH NO ERROR");
	}
	else
	{
		list_of_all_members=viit_atts;
		console.log(list_of_all_members[0]);
	}
});



app.get("/",function(req,res)
	{
		res.render("viit_attendence.ejs");
	});

app.get("/attendence",function(req,res)
	{	
		res.render("take_att_page.ejs",{list_of_all_members:list_of_all_members});
	});

var use_posted_att;

app.post("/post_att",function(req,res)
{
	res.redirect("/attendence");
	// console.log(req.body);
	use_posted_att = Object.keys(req.body.student);
	console.log(use_posted_att);
	for(var i=0;i < use_posted_att.length ;i++)
	{
		console.log(use_posted_att[i]);
	}
});






app.listen(3000,function(){
	console.log("SERVER 3000 HAS STARTED");
});