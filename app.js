const path = require('path')
const ejs = require('ejs')
const express = require('express')
const mysql = require('mysql')
const bodyParser = require('body-parser')
const app = express()

// Database connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'crud'
});

// check if DB is connected
connection.connect(function(error) {
    if(!!error) console.log(error)
   else console.log('Database connected')
});

//set views file
app.set('views', path.join(__dirname, 'views'))

//set view engine
app.set('view engine', 'ejs')
app.use('/assets', express.static('assets'));
app.use(express.static('assets'));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended : false}));  



app.get('/', (req, res ) => {
    let sql = 'SELECT * FROM users';
    let query = connection.query(sql, (err, rows) => {
        if(err) throw err;
        res.render('user_index', {
            title: 'CRUD Operation using NodeJS / Mysql / Express',
            users : rows
    });
    
    });
});

// get add
app.get('/add', (req, res) => {
    res.render('user_add', {
        title: 'CRUD Operation using NodeJS / Mysql / Express'
    });
});

// add new user
app.post('/save', (req, res) => {
    let data = {name: req.body.name, email: req.body.email, phone: req.body.phone};
    let sql = "INSERT INTO users SET ?";
    let query = connection.query(sql, data, (err, results) => {
        if(err) throw err;
        res.redirect('/');
    });
});

//edit user
app.get('/edit/:userId', (req, res) => {
    const userId = req.params.userId;
    let sql = `SELECT * FROM users WHERE id = ${userId}`;
    let query = connection.query(sql, (err, result) => {
        if(err) throw err;
        res.render('user_edit', {
            title: 'CRUD Operation using NodeJS / Mysql / Express',
            user: result[0]
        });
    });
});

// update user
app.post('/update', (req, res) => {
    const userId = req.body.id
    let sql = "update users SET name='"+req.body.name+"', email='"+req.body.email+"',phone='"+req.body.phone+"'  WHERE id="+userId;
    let query = connection.query(sql, (err, results) => {
        if(err) throw err;
        res.redirect('/');
    });
});

// delete user
app.get('/delete/:userId', (req, res) => {
    const userId = req.params.userId;
    let sql = `DELETE from users WHERE id= ${userId}`
    let query = connection.query(sql, (err, result) => {
        if(err) throw err;
        res.redirect('/');
    });
});

// Server listening
app.listen(3000, () => {
    console.log('Server running at port 3000')
});