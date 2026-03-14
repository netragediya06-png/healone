const WellnessProgram = require("../models/WellnessProgram");


/* GET PROGRAMS */

exports.getPrograms = async(req,res)=>{

try{

const programs = await WellnessProgram
.find()
.populate("category","name");

res.json(programs);

}catch(err){

res.status(500).json(err);

}

};


/* ADD PROGRAM */

exports.addProgram = async(req,res)=>{

try{

const program = new WellnessProgram({

title:req.body.title,
description:req.body.description,
category:req.body.category,
specialist:req.body.specialist,
durationDays:req.body.durationDays,
price:req.body.price,
level:req.body.level,
image:req.file ? "/uploads/programs/"+req.file.filename : ""

});

await program.save();

res.json(program);

}catch(err){

console.log(err);
res.status(500).json(err);

}

};


/* UPDATE */

exports.updateProgram = async(req,res)=>{

try{

const data = {

title:req.body.title,
description:req.body.description,
category:req.body.category,
durationDays:req.body.durationDays,
price:req.body.price,
level:req.body.level

};

if(req.file){

data.image = "/uploads/programs/"+req.file.filename;

}

const program = await WellnessProgram.findByIdAndUpdate(

req.params.id,
data,
{new:true}

);

res.json(program);

}catch(err){

res.status(500).json(err);

}

};


/* DELETE */

exports.deleteProgram = async(req,res)=>{

try{

await WellnessProgram.findByIdAndDelete(req.params.id);

res.json({message:"Deleted"});

}catch(err){

res.status(500).json(err);

}

};