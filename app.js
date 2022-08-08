const express =require('express');
const app = express();
const bodyparser = require('body-parser');
const mysql = require('mysql');
const configdb ={
    host: 'localhost',
    user : 'root',
    password: 'Admin123',
    database: 'pro2'
}
const connection = mysql.createConnection(configdb);
connection.connect(function(error){
    if(error){
        console.log('database is not connected', error);
    }
    else{
        console.log('database is connected');
    }
});

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.use(bodyparser.urlencoded({extended:false}));

app.get('/home', function(req, res){
    res.render('home');
});

app.get('/singup', function(req, res){
    res.render('singup');
});

app.post('/singup', function(req, res){
    const firstname= req.body.firstname;
    const lastname= req.body.lastname;
    const address= req.body.address;
    const email= req.body.email;
    const password= req.body.password; 
    const getuser = `insert into user(firstname, lastname, address, email, password)values('${firstname}', '${lastname}', '${address}', '${email}', '${password}')`;
    connection.query(getuser, function(error, result){
        if(error){
            console.log('database query is not run', error);
        }else{
            console.log('database query is run', result);
             res.redirect('/userlist');

        }
    })
});

app.get('/userlist', function(req, res){
    const data={
        title: 'user:data'
    };
    const selectuser = `select * from user`;
    connection.query(selectuser, function(error, result){
        if(error){
            console.log('data query is run', error);
        }else{
            console.log('data query is run', result);
            data.user= result;
            res.render('userlist', data);

        };
    });
});

app.get('/edit_user', function(req, res){
    const data = {
        title: 'userlist'
    };
    const  userId = req.query.userId;
    const edituser = `select * from user where id='${userId}'`;
    connection.query(edituser, function(error, result){
        if(error){
            console.log('query is not run', error);
        }else{
            console.log('query is run', result);
           let  prodata=result[0];
            data.user = prodata;
            res.render('edit_user', data);
        }
    })
});

app.post('/update', function(req, res){
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const address = req.body.address;
    const email = req.body.email;
    const password = req.body.password;
    const userId = req.query.userId;
    const updateuser = `update user set firstname='${firstname}', lastname='${lastname}', address='${address}', email='${email}', password='${password}' where id='${userId}'`;
    connection.query(updateuser, function(error, result){
        if(error){
            console.log('data query is not run', error)
        }else{
            console.log('data query is run', result)
            res.redirect('/userlist')
        }
    })
});

app.get('/delete', function(req, res){
    const userId = req.query.userId;
    const deleteuser = `delete from user where id='${userId}'`;
    connection.query(deleteuser, function(error, result){
        if(error){
            console.log('query is not run', error)
        }else{
            console.log('query is run', result);
            res.redirect('/userlist');
        }
    })
})

const port = 4009;
app.listen(port, function(){
    console.log('server is start', port);
});