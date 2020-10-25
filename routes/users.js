var express = require('express');
// const { ReplSet } = require('mongodb');
var shuffle = require('shuffle-array');
var router = express.Router();
var db = require('../config/connection');
var objectId= require('mongodb').ObjectId
var axios = require('axios');
/* GET home page. */


router.get('/signup', (req, res) => {
  res.render('signUp');
});

router.post('/signup', (req, res) => {
  const { username, email, password } = req.body
  console.log(req.body);
  db.get().collection('users').insertOne({
    username: req.body.username,
    email: req.body.email,
    password: req.body.pass
  }).then(() => {
    res.render('UserLogin');
  }).catch((err) => {
    res.render('signUp', { msg: 'invalid email or username' });
  });
});



router.get('/', (req, res) => {
  res.render('UserLogin');
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);

  db.get().collection('users').findOne({

    email: req.body.email,
    password: req.body.password
  }, (err, data) => {

    if (data) {
      var email = data.email;
      req.session.loggedIn =true;
      req.session.email = email
      res.render('userHome');
    } else {
      res.render('UserLogin');
    }
  });
});

router.get('/categories',(req,res)=>{
  res.render('userQuestions');
})

router.get("/personaltest", (req, res) => {
  res.render("personaltest")
})

router.get('/bussiness', (req, res) => {

  db.get().collection('questions').find({ category: 'bussiness' }).toArray((err, data) => {
    res.render('qpageone', { data: data })
  })
});

router.post('/bussiness_submit', async (req, res) => {
  let score = 0;
  let answers = new Array;
  let result = Object.values(req.body)
  function getAnswer(){
    return new Promise(async(resolve,reject)=>{
      await db.get().collection('questions').find({ category: 'bussiness' }).toArray((err, datas) => {
        datas.forEach(data =>{
          answers.push(data.answer)
        })
        resolve()
      })
     
    })
  }
  getAnswer().then(()=>{
    for(let i = 0; i< answers.length ; i++){
      if(answers[i] == result[i]){

        console.log(answers);
        console.log(result);
        score ++;
      }
    }
    db.get().collection('users').updateOne({email:req.session.email},{$set:{score:score}})
    .then(()=>{
      res.redirect('/validation');
    })
    console.log(score);
  })
  
})



router.get('/marketing', (req, res) => {

  db.get().collection('questions').find({ category: 'marketing' }).toArray((err, data) => {
    if (err) res.json(err)

        res.render('qpageFour',{data:data})
  })

})

router.post('/marketing_submit', async (req, res) => {
  let score = 0;
  let answers = new Array;
  let result = Object.values(req.body)
  function getAnswer(){
    return new Promise(async(resolve,reject)=>{
      await db.get().collection('questions').find({ category: 'marketing' }).toArray((err, datas) => {
        datas.forEach(data =>{
          answers.push(data.answer)
        })
        resolve()
      })
     
    })
  }
  getAnswer().then(()=>{
    for(let i = 0; i< answers.length ; i++){
      if(answers[i] == result[i]){

        console.log(answers);
        console.log(result);
        score ++;
      }
    }
    db.get().collection('users').updateOne({email:req.session.email},{$set:{score:score}})
    .then(()=>{
      res.redirect('/validation')
    })
    console.log(score);
  })
  
})

router.get('/tech', (req, res) => {
  db.get().collection('questions').find({ category: 'tech' }).toArray((err, data) => {
    if (err) res.json(err)
    console.log(data);
    res.render('qpageTwo',{data:data});
  })

})

router.post('/tech_submit', async (req, res) => {
  let score = 0;
  let answers = new Array;
  let result = Object.values(req.body)
  function getAnswer(){
    return new Promise(async(resolve,reject)=>{
      await db.get().collection('questions').find({ category: 'tech' }).toArray((err, datas) => {
        datas.forEach(data =>{
          answers.push(data.answer)
        })
        resolve()
      })
     
    })
  }
  getAnswer().then(()=>{
    for(let i = 0; i< answers.length ; i++){
      if(answers[i] == result[i]){

        console.log(answers);
        console.log(result);
        score ++;
      }
    }
    db.get().collection('users').updateOne({email:req.session.email},{$set:{score:score}})
    .then(()=>{
      res.redirect('/validation');
    })
    console.log(score);
  })
  
})

router.get('/social', (req, res) => {
  db.get().collection('questions').find({ category: 'social' }).toArray((err, data) => {
    if (err) res.json(err)
    res.render('qpageThree',{data:data})
  })

})

router.post('/social_submit', async (req, res) => {
  let score = 0;
  let answers = new Array;
  let result = Object.values(req.body)
  function getAnswer(){
    return new Promise(async(resolve,reject)=>{
      await db.get().collection('questions').find({ category: 'socail' }).toArray((err, datas) => {
        datas.forEach(data =>{
          answers.push(data.answer)
        })
        resolve()
      })
     
    })
  }
  getAnswer().then(()=>{
    for(let i = 0; i< answers.length ; i++){
      if(answers[i] == result[i]){

        console.log(answers);
        console.log(result);
        score ++;
      }
    }
    db.get().collection('users').updateOne({email:req.session.email},{$set:{score:score}})
    .then((res)=>{
      console.log(res);
    })
    res.redirect('/validation');
    console.log(score);
  })
  
})

router.get('/logout',(req,res)=>{
  req.session.destroy();
  res.redirect('/');
});


router.get('/validation',(req,res)=>{
  let poor =false;
  let average=false;
  let good= false;

  db.get().collection('users').findOne({email:req.session.email})
  .then((data)=>{
    console.log(data);
    if(data.score <3){
      poor=true;

    }else if(data.score <=4 && data.score >=3){
      average=true;
    }else{
      good=true;
    }
    res.render('result',{poor,average,good});
  }).catch((err)=>{
    res.send(err);
  })
})







module.exports = router;
