var bodyParser = require('body-parser');
var mongoose =require("mongoose");
var express= require("express");
var app = express();

mongoose.connect("mongodb+srv://qazxsw:qazxsw@cluster0-ytkxo.mongodb.net/test?retryWrites=true&w=majority",function(err,res)
{
		if(err)
		{
			console.log("mongo lab server not connected");
			console.log(err);
		}
		else
		{
			console.log("Connectd to mongolab db");
		}
});


var viit_att_schema = new mongoose.Schema({
	name : String,
	no_of_present: Number,
	no_of_absent: Number
});

var att_history_schema = new mongoose.Schema({
	time : String ,
	att_stats : String,
});

app.use(bodyParser.urlencoded({extended:true}));

var viit_att= mongoose.model("viit_att",viit_att_schema);

var att_history = mongoose.model("att_history",att_history_schema);

var list_of_all_members;
var list_of_all_members_sorted;

viit_att.find({},function(err,viit_atts)
{
	if (err) {
		console.log("OH NO ERROR");
	}
	else
	{
		console.log("fetching data now");
		console.log(viit_atts);
		list_of_all_members=viit_atts;
		// console.log(list_of_all_members[0]);
		// console.log(list_of_all_members);
		list_of_all_members_sorted = list_of_all_members.sort(function(a,b) {
				    return b.no_of_present - a.no_of_present ;
				});
		
		console.log(list_of_all_members_sorted);
	}
});






var att_history_list ;
att_history.find({},function(err,att_history)
{
	if (err) {
		console.log("OH NO ERROR");
	}
	else
	{
		att_history_list=att_history;
		// console.log(att_history_list);
		// console.log(att_history_list[0].time);
	}
});


app.get("/",function(req,res)
	{
		res.render("viit_attendence.ejs",{att_history_list:att_history_list,list_of_all_members_sorted:list_of_all_members_sorted});
	});

app.get("/attendence",function(req,res)
	{	
		res.render("take_att_page.ejs",{list_of_all_members:list_of_all_members});
	});

var use_posted_att;

app.post("/post_att",function(req,res)
{
	
	// console.log(req.body);
	use_posted_att = Object.keys(req.body.student);
	console.log(use_posted_att);
	for(var i=0;i < use_posted_att.length ;i++)
	{
	console.log(use_posted_att[i]);
	viit_att.update({name : use_posted_att[i]},
		{ $inc : {no_of_present : 1 } },function(err,res)
		{
			if(err)
			{
				console.log("OH NO");
				// console.log(res);
				// console.log(viit_att.name);
				// console.log(err);
			}
			else
			{
				// console.log("UPDATE SUCCESFULL");
				// console.log(list_of_all_members);
			}
		});
	}
	for(var i=0 ;i < list_of_all_members.length ;i++)
	{
		var check = true ;
		for(var j=0;j < use_posted_att.length ;j++)
		{
			if ( list_of_all_members[i] == use_posted_att[j])
			{
				check = false;
			}
		}
		if (check == true )
			{
				viit_att.update({name : list_of_all_members[i].name},
					{ $inc : {no_of_absent : 1 } },function(err,res)
					{
						if(err)
						{
							console.log("OH NO 2");
							console.log(err);
							// console.log(viit_att.name);
							// console.log(err);
						}
						else
						{
							// console.log("UPDATE SUCCESFULL 2");
						}
					});
			}
	}

	var date = new Date();
	var use_date = date.toString(); 
	var total_att = list_of_all_members.length.toString();
	var pre_att = (use_posted_att.length ).toString();
	att_history.create({ time : use_date , att_stats : pre_att + "/" + total_att},function(err,att)
		{
			if(err)
			{
					console.log("OH NO 3");
			}
			else
			{
				console.log("SUCESS OF ATT att_history");
			}

		});
	res.redirect("/");
});





app.listen( process.env.PORT || 3000 , function(){
	console.log("SERVER 3000 HAS STARTED");
});