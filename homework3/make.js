#!/usr/bin/node

const http = require('http'),
      qs = require('querystring'), 
      url = require('url'),   
      fs = require('fs');

let usr = [
  {name:'admin',pswd:'admin'}
];

let chapterList = JSON.parse(fs.readFileSync('./js/data.js','utf8'));

// 请求监听（本地路径访问返回NAN）
http.createServer((req,res)=>{
  
  console.log('==========');
  console.log('[req msg]', `${req.method} ${req.url} HTTP/${req.httpVersion}`);

  switch(req.method) {
    case 'GET':
      console.log('METHOD: GET');
      getfun(req,res);
      // console.log('==========');
      break;

    case 'POST':
      console.log('METHOD: POST')
      postfun(req,res);
      break;

    default:
      console.log('ERROR METHOD, RETURN ERROR', + req.method);
      err(res);
      break;
  }
}).listen(8083);

// GET（改进：减少判断 提高兼容性）
// 跳转+请求数据
function getfun(req,res){
  let path = url.parse(req.url);
  let file = __dirname; // D:\GAOYUSHU\task\task03\task

  // console.log(req.headers);

  let pathname1 = path.pathname.split('.'); // 分类型
  let pathname2 = path.pathname.split('/'); // 加路径
  console.log('----------');
  console.log(pathname1);
  console.log(pathname2); 

  if(req.url == '/list'){
    var data = JSON.stringify(chapterList);
    res.setHeader('Content-Length',Buffer.byteLength(data));
    res.setHeader('Content-Type','text/plain;charset="utf-8"');
    res.setHeader('Access-Control-Allow-Origin','*');
    res.end(data);
  } else if(pathname1.length == 1){
    switch(pathname2[1]){
      case 'list':
        file += '/chapterList.html';
        break;
      case 'login':
        file += '/login.html';
        break;
      case 'listmanager':
        file += '/list.html';
        break;
      case 'addChapter':
        file += '/addChapter.html';
        break;
      case 'detail':
        file += '/chapter.html';
        break;
      case 'getDetail': 
        let id = qs.parse(path.query).chapterId;
        let obj;

        for(let i = 0; i < chapterList.length; i++){
          if(chapterList[i].chapterId == id){
            obj = chapterList[i];
            break;
          }
        }
        
        res.end(JSON.stringify(obj));
        break;
      default:
        console.log('ERROR GET!');
        console.log('PATH.PATHNAME: ' + path.pathname);
    } 

    console.log('FILE: ' + file);

    fs.readFile(file,(err,data)=>{
      if(err){
        console.log(err.message);
        res.end(err.message)
      }
      res.writeHead(200,{
        'Content-Type':'text/html'
      })
      res.end(data);
    });
  }else{
    console.log('FILE: ' + file);

    if(pathname2[1] == 'images' || pathname2[1] == 'css' || pathname2[1] == 'js' ){
      file += req.url;
    }else{
      file += '/' + pathname2.slice(2).join('/');
    }
    let type = pathname1[pathname1.length-1];

    console.log('FILE: ' + file);
    console.log('TYPE: ' + type);

    fs.readFile(file,(err,data)=>{
      if(err){
        console.log(err.message);
        res.statusCode = 404;
        res.end(err.message);
      }else{
        if(type === 'js'|| type === 'html' || type === 'css'){
          res.writeHead(200,{
            'Content-Type':'text/' + type
          })
        }else{
          res.writeHead(200,{
            'Content-Type':'image/' + type
          })
        }
        res.end(data);
      }
    });
  }
}

// POST
// 登录 + 添加
function postfun(req, res){
  switch(req.url){
    case '/login/':
      postlogin(req, res);
      break;
    case '/add':
      postadd(req, res);
      break;
    default:
      console.log('POST ERROR', req.url);
  }
}

// postlogin
// 登录界面 验证身份
function postlogin(req, res){
  let user = '';
  let sign = 0;

  req.on('data', (data)=>{
    user += data;
  });

  req.on('end', ()=>{
    user = JSON.parse(user);

    usr.map((item)=>{
      if(item.name == user.name && item.pswd == user.pswd){
        sign = 1;
        res.statusCode = 200;
        res.end('OK');
      }
    });
    if(sign == 0){
      res.statusCode = 404;
      res.end('ERROR')
    }

  });
}

// postadd
// 添加文章
function postadd(req, res){
  let essay = '';
  req.on('data',(data)=>{
    essay += data;
  });
  req.on('end',()=>{
    essay = qs.parse(essay.toString('utf8'));
    let item = {
      chapterId: chapterList.length+1,
      chapterName: essay.title || '',
      imgPath: essay.imgPath || undefined,
      chapterDes: essay.chapterDes || undefined,
      chapterContent: essay.content || '',
      publishTimer: new Date().getTime(),
      author: essay.author || undefined,
      views: essay.views || undefined,
    }
    chapterList.push(item);
    fs.writeFileSync('./js/data.js',JSON.stringify(chapterList));
  })
  res.end('OK');
}

// 报错OK
function err(res) {
  let msg = 'ERROR MOTHOD! GET/POST ONLY!';

  res.statusCode = 404;
  res.setHeader('Content-Length', msg.length);
  res.setHeader('Content-Type', 'text/plain');

  res.end(msg);
}