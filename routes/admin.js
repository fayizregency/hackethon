var express = require('express');
// const { Db } = require('mongodb');
var router = express.Router();
var db = require('../config/connection')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/add_question',(req,res)=>{
  res.render('adminHome');
});

router.post('/add_question',(req,res)=>{
  const {category,question,option1,option2,option3,option4} =req.body
  console.log(req.body);

  db.get().collection('questions').insertOne({
    question:req.body.question,
    option1:req.body.option1,
    option2:req.body.option2,
    option3:req.body.option3,
    option4:req.body.option4,
    category:req.body.category
  }).then(()=>{
    res.json("question added")
  }).catch((err)=>{
    res.json(err);
  })
  });

module.exports = router;
