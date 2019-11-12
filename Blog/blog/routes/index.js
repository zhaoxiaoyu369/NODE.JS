var express = require('express');
var {users,chapterList} = require('../data.json');
var work = express.Router();

/* GET home page. */
work.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
work.post('/',function(req,res,next){
  if(users[0].username === req.body.name && users[0].password === req.body.mima){
    res.redirect('/from');
  }else if(req.body.name === '' && req.body.mima !== ''){
    res.end('Please enter a user name.')
  }else if(req.body.mima === '' && req.body.name !== ''){
    res.end('Please input a password.')
  }else if(req.body.name === '' && req.body.mima === ''){
    res.end('Please enter your user name and password.')
  }else{
    res.end('Incorrect user name or password.')
  }
});
module.exports = work;
