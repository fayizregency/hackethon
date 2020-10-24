var express = require('express');
// const { ReplSet } = require('mongodb');
var shuffle = require('shuffle-array');
var router = express.Router();
var db = require('../config/connection');
var axios = require('axios');
/* GET home page. */


router.get('/signup', (req, res) => {
  res.render('signUp');
});

router.post('/signup', (req, res) => {
  const { username, email, password } = req.body
  db.get().collection('users').insertOne({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
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
      res.send('home');
    } else {
      res.send('err')
    }
  });
});


router.get('/personal', (req, res) => {

  db.get().collection('questions').find({ category: 'personal' }).toArray((err, data) => {
    res.render('qpageone', { data: data })
  })
});

router.post('/personal_submit', async (req, res) => {
  let score = 0;
  let answers = new Array;
  let result = Object.values(req.body)
  function getAnswer(){
    return new Promise(async(resolve,reject)=>{
      await db.get().collection('questions').find({ category: 'personal' }).toArray((err, datas) => {
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
        score ++;
      }
    }
    console.log(score);
  })
  
})



router.get('/bussiness', (req, res) => {

  db.get().collection('questions').find({ category: 'bussiness' }).toArray((err, data) => {
    if (err) res.json(err)

    // for(let i=0;i<data.length;i++){
    //   array.push([data[i].option1,
    //     data[i].option2,data[i].option3,data[i].option4])
    //    var sheffled= shuffle(array[i]);
    //     console.log('shuffled:'+sheffled);
    // }


    // console.log();
    // console.log(array);
    res.json('got all bussiness questions');
  })

})

router.get('/tech', (req, res) => {
  db.get().collection('questions').find({ category: 'tech' }, (err, data) => {
    if (err) res.json(err)
    res.json('got all tech questions');
  })

})

router.get('/social', (req, res) => {
  db.get().collection('questions').find({ category: 'social' }, (err, data) => {
    if (err) res.json(err)
    res.json('got all social questions');
  })

})

router.get('/marketing', (req, res) => {
  db.get().collection('questions').find({ category: 'marketing' }, (err, data) => {
    if (err) res.json(err)
    res.json(data);
  })

});



router.post('/validate_bussiness', (req, res) => {
  const { answer } = req.body.answer
  if (answer === 'option1') {
    score++;
  }
  res.json('1 qestion completed');
});

router.post('/')







module.exports = router;
