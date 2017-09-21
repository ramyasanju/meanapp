const bcrypt = require('bcrypt');
var db = require('../db')


exports.all = function(cb) {
    var collection = db.get().collection('comments')
  
    collection.find().toArray(function(err, docs) {
      cb(err, docs)
    })
  }

  exports.register = function(req,cb) {
    console.log(" i am inside adduser post route");
    console.log("the type of req.body", typeof req.body)
    req.body.postcount=0;
    var todo = req.body;
    let hash_password = bcrypt.hashSync(todo.password, 5);
    console.log("the encrypted password is", hash_password)
    todo.password = hash_password
    console.log("the todo is", todo);
    db.get().collection('members').save(todo, function(err, result) {
        if (err) {
            console.log("error is", err);
            console.log("error code is", err.code)
            let content = {
                success: false,
                message: 'This Email id is already taken'
                };
                cb(err, content)
        } else {
            console.log("i am saved");
            console.log("result is",result)
            let content = {
                success: true,
                message: 'You are Registered. Login to see details'
                };
                cb(err, content)
        }
    })
  }

  
exports.login = function(req,cb) {
    var todo = req.body;
    console.log("the todo is", todo);
    // connection((db) => {
    db.get().collection('members').findOne({'email':todo.email}, function(err, result) {
        if (err) 
            res.send(err);
        if( result == null ) {
            console.log("inside null if");
            let content = {
                success: false,
                message: 'User does not exists'
            };
            cb(err, content)
        }else if( result != null ) {
            console.log("i am inside else if")
            
            if(bcrypt.compareSync(result.password, todo.password)) {
                console.log("inside password checking if");
                let content = {
                    success: false,
                    message: 'Password doesnt match'
                };
                cb(err, content)
            }else {
                console.log(result);
                let content = {
                    success: true,
                    message: 'You are a valid user',
                    data: result

                };
                console.log("the content is",content)
                cb(err, content) 
            }
        }
            
        
    })
  }