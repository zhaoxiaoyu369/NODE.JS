var express = require('express');
var {users,chapterList} = require('../data.json');
var work = express.Router();

/* GET users listing. */
work.get('/', function(req, res, next) {
  res.render('from',{items:chapterList}
);
});
module.exports = work;
