var mysql = require('mysql');
var express=require("express");
var bodyParser=require('body-parser');
const session = require('express-session');
const path=require('path');
const multer=require('multer');
var app=express();

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root03",
  database:'ems'
});
  
con.connect(function(err) {
  if (err) throw err;
  
}); 

// -----------------------------------------//
app.set('view engine','ejs');

app.use(express.static(__dirname + '/public'));
app.get('/register', function(req,res){
  res.setHeader('Content-Type', 'text/html');
  res.sendFile(__dirname+'/public/reg/reg.ejs');
});




app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));



// multer setup
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, callback) => {
    callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// general user regestration
app.post('/user',function(req,res){
  var name=req.body.name;
  var email=req.body.email;
  var address=req.body.address;
  var phone=req.body.phone;
  var password=req.body.password;

  var sql=`Insert into user(name,email,address,phone,password) values("${name}","${email}","${address}","${phone}","${password}")`;

  con.query(sql,(err,result)=>{
    if(err) throw err;
    res.send(result);
  })

})



// eventplaner registration

app.post('/eventplaner',function(req,res){
  var Cname=req.body.Cname;
  var email=req.body.email;
  var address=req.body.address;
  var phone=req.body.phone;
  var zip=req.body.zip;
  var password=req.body.password;

  var sql=`Insert into eventplaner(Cname,email,address,phone,zip,password) values("${Cname}","${email}","${address}","${phone}","${zip}","${password}")`;

  con.query(sql,(err,result)=>{
    if(err) throw err;
    res.send(result);
  })

})



//login user

app.use(session({ secret: 'cccssseee', resave: false, saveUninitialized: true }));

//routes
app.get('/', (req, res) => {
  if (req.session.name) {
      res.redirect('/home');
  } else {
    res.setHeader('Content-Type', 'text/html');
    res.sendFile(__dirname+'/public/login/logins.ejs');
  }
});

app.get('/home', (req, res) => {
  if (req.session.name) {
    // res.setHeader('Content-Type', 'text/html');
    // res.sendFile(__dirname+'/public/mainpage/homepost.ejs',{name: req.session.name});
    const templatePath = path.join(__dirname, 'public', 'mainpage', 'homepost.ejs');
    res.render(templatePath, { name: req.session.name });



  } else {
      res.redirect('/');
  }
});

// log in verification  
app.post('/login',(req,res)=>{
  const {email,password}=req.body;
  var sql=`SELECT * FROM user where email= ? AND password= ?`;
  con.query(sql,[email,password],(err,result)=>{
    if(err) throw err;
    if(result.length===1){
      console.log(result[0].name);
      req.session.name=result[0].name;
      res.redirect('/home');
    }else{
      res.send("invaid userer name and password");
    }
  });
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});



// home page
// app.get('/', function(req,res){
//   res.setHeader('Content-Type', 'text/html');
//   res.sendFile(__dirname+'/public/mainpage/homepost.ejs');
// });




// //login page
// app.get('/log', function(req,res){
//   res.setHeader('Content-Type', 'text/html');
//   res.sendFile(__dirname+'/public/login/logins.ejs');
// });



// event planer
app.get('/log-eventP', function(req,res){
  const templatePath = path.join(__dirname, 'public', 'eventplaner', 'eventPlaner.ejs');
  res.render(templatePath);

});


//eventprofile

app.get('/eventprofile', (req, res) => {
  if (req.session.Cname) {
    const templatePath = path.join(__dirname, 'public', 'eventplaner', 'eventplanerprofile.ejs');
    res.render(templatePath, { name: req.session.Cname});
  } else {
      res.redirect('/log-eventP');
  }
});

//event planer cover photo upload
app.post('/uploadeventcover', upload.single('profilePicture'), (req, res) => {
  const profilePicture = req.file.filename;
  var val=req.session.email;
  console.log(val);
  const sql = 'UPDATE eventplaner SET coverphoto = ? WHERE email = ?';
  con.query(sql, [profilePicture,val], (err, result) => {
    if (err) {
      console.error('Error inserting data: ' + err.message);
    } else {
      console.log('Data inserted');
      res.redirect('/eventprofile')
    }
  });
});





app.post('/login-eventP',(req,res)=>{
  const {Cemail,Cpassword}=req.body;
  console.log(Cemail);
  console.log(Cpassword);
  var sqlp="SELECT * FROM eventplaner where email= ? AND password= ?";
  con.query(sqlp,[Cemail,Cpassword],(err,result)=>{
    console.log(result)
    if(err) throw err;
    if(result.length===1){
      console.log(result[0].Cname);
      req.session.Cname=result[0].Cname;
      req.session.email=result[0].email;
      console.log(req.session.email);
      
      // const templatePath = path.join(__dirname, 'public', 'eventplaner', 'eventplanerprofile.ejs');
      // res.render(templatePath);
      res.redirect('/eventprofile');
    }else{
      
      res.send("invaid userer name and password");
      
    }
  });
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});





///eventplaner main page


app.get('/eventdata', (req, res) => {
  // Fetch data from the database
  con.query('SELECT * FROM eventplaner', (error, results) => {
      if (error) {
          throw error;
      }
      
      res.json(results);
  });
});





app.listen(5000);

module.exports=con;