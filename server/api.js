const express = require('express');
const router = express.Router();
// const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
var async = require('async');
const bcrypt = require('bcrypt');
var db = require('../db')
var login_module = require('../module/login')
var multer = require('multer');
var DIR = 'src/assets/uploads/';
var upload = multer({dest: DIR}).single('photo');


// router.get('/', function(req, res, next) {
// // render the index page, and pass data to it.
//   res.render('index', { title: 'Express' });
// });

//our file upload function.
router.post('/upload', function (req, res, next) {
    console.log("i am inside upload image comment router")
     var path = '';
     upload(req, res, function (err) {
        if (err) {
            console.log("An error occurred when uploading")
          // An error occurred when uploading
          console.log(err);
          return res.status(422).send("an Error occured")
        }  
       // No error occured.
        path = req.file.path;
        console.log("the modified path is ",path.substr(path.indexOf('/')+1))
        console.log("uploaded",req.file)
        return res.send(path.substr(path.indexOf('/')+1)); 
  });     
})

// Connect
// const connection = (closure) => {
//     return MongoClient.connect('mongodb://localhost:27017/mean', (err, db) => {
//         if (err) return console.log(err);

//         closure(db);
//     });
// };

// Error handling
const sendError = (err, res) => {
    response.status = 501;
    response.message = typeof err == 'object' ? err.message : err;
    res.status(501).json(response);
};

// Response handling
let response = {
    status: 200,
    data: [],
    message: null
};

// // Get users
// router.get('/users', (req, res) => {
//     // console.log("request",req);
//     connection((db) => {
//         db.collection('users')
//             .find()
//             .toArray()
//             .then((users) => {
//                 response.data = users;
//                 res.json(response);
//             })
//             .catch((err) => {
//                 sendError(err, res);
//             });
//     });
// });


router.delete('/deleteComment/:commentId', (req, res) => {
    var idforpostdelete = new ObjectID(req.params.commentId);
    var delete_details = { '_id': idforpostdelete };
    db.get().collection('comments').deleteOne(delete_details, (err, item) =>{
        if (err){
            console.log("error is", err);
            console.log("error code is", err.code)
            let content = {
                success: false,
                message: 'There is a error in deleting the comment'
            };
            res.json(content);

        } else {
            let content = {
                success: true,
                message: 'deleted the comment'
            };
            res.json(content);
        }
    })



})


//Delete the given post
router.delete('/delete_post/:id/:uid', (req, res) => {
    console.log("postid",req.params.id)
    console.log("userid",req.params.uid)
    var idforpostdelete = new ObjectID(req.params.id);
    var delete_details = { '_id': idforpostdelete };
    var idforcountdec = new ObjectID(req.params.uid);
    // connection((db) => {
    db.get().collection('posts').deleteOne(delete_details, (err, item) =>{
        if (err){
            console.log("error is", err);
            console.log("error code is", err.code)
            let content = {
                success: false,
                message: 'There is a error in deleting the post'
            };
            res.json(content);

        } else {
            console.log("post is deleted without error",item)
            let content = {
                success: true,
                message: 'The post is deleted',
                data: item
            };
            db.get().collection('members').update({ '_id': idforcountdec },{ $inc: { 'postcount': -1 } }, function(err, result) {
                if (err) {
                    console.log("error is", err);
                    console.log("error code is", err.code)
                }
                else{
                    console.log("updated the postcount after deleting post")
                }
            });  

            res.json(content);
            

        }
    })
            
    // });
});



//Get comment text for the give commentid
router.get('/commentText/:commentId', (req, res) => {
    var details = {'_id': new ObjectID(req.params.commentId)};
    db.get().collection('comments').findOne(details, (err, item) =>{
        if (err){
            console.log("error is", err);
            console.log("error code is", err.code)
            let content = {
                success: false,
                message: 'There is a error in getting the comment text to update'
            };
            res.json(content);

        } else {
            console.log("comment text without error",item)
            let content = {
                success: true,
                message: 'The comment text to be updated is retrived',
                data: item
            };
            res.json(content);
            

        }
    })
})

//Get all comments for the given postid
router.get('/comments/:postId', (req, res) => {
    var details = { 'postid': req.params.postId };
    // connection((db) => {
    db.get().collection('comments').find(details).toArray(function(err, items){
        if(err){
            console.log("error is", err);
            console.log("error code is", err.code)
            let content = {
                success: false,
                message: 'There is a error in getting all the comments for the post'
            };
            res.json(content);
        } else {
            console.log("All comments for the given post",items)
            console.log("Type", typeof items)
            async.eachSeries(items, function (scomment, callback) {
                console.log("inside comments async.each",scomment.userid)
                var name = {'_id':new ObjectID(scomment.userid)};
                console.log(name);
                // connection((db) => {
                console.log("inside connection")
                db.get().collection('members').findOne(name, function(err, result) {
                    if (err) 
                        res.send(err);
                    else {
                        console.log("the username from member table for given userid",result)
                        scomment.commentby = result.uname                      
                        callback(null)
                    }
                })
                // })
            },function(err,data){
                if(err){
                    console.log(" i am in comments async err");
        
                }else{
                    console.log("i am in comments asyns finish",items)
                    console.log("%%%%%%%")
                    let content = {
                        success: true,
                        message: 'The comments are retrived ',
                        data: items
                    };
                    res.json(items)
                    
                }
            })
            

        }
    })
    // })

})


//Get All Posts
router.get('/posts/:id', (req, res) => {
    console.log("i am inside getall user post app route")
    console.log("request",req.params.id);
    
    console.log('the userid for which all the posts to be taken',req.params.id)
    var details = { 'userid': req.params.id };
    // connection((db) => {
    db.get().collection('posts').find().toArray(function(err, items){
        if(err){
            console.log("error is", err);
            console.log("error code is", err.code)
            let content = {
                success: false,
                message: 'There is a error in getting all the user post'
            };
            res.json(content);
        } else {
            console.log("All Post for the given user",items)
            console.log("Type", typeof items)
            console.log("length",items.length)
            
            var tagnames = ''
            async.eachSeries(items, function (spost, callback1) {
                var tagarray = []
                console.log("the items is",spost)
                tagarray = JSON.parse(spost.tags);
                console.log("the length of tag array is",tagarray.length)

                tag_words = []
                async.eachSeries(tagarray, function (tid, callback2) {
                    console.log("inside async.each",tid)
                    var name = {'_id':new ObjectID(tid)};
                    console.log(name);
                    // connection((db) => {
                    console.log("inside connection")
                    db.get().collection('tags').findOne(name, function(err, result) {
                        if (err) 
                            res.send(err);
                        else {
                            console.log("the record from tag table for given tagid",result)
                            tag_words.push(result.name)
                            console.log("the length of tag words is",tag_words.length)
                            callback2(null,tag_words)
                            

                        }
                    })
                    // })
                },function(err,data){
                    if(err){
                        console.log(" i am in async err");
            
                    }else{
                        // tagnames = JSON.stringify(tag_words);
                        tagnames = tag_words.toString()
                        console.log("the tagword's are", tagnames)
                        spost.tags = tagnames
                        console.log("^^^^^^^",spost)
                        callback1(null)
                        
                    }
                })
                
                
            },function(err,data){
                if(err){
                    console.log(" i am in first async err");
        
                }else{
                    console.log("i am in first asyns else")
                    console.log("%%%%%%%")
                    let content = {
                        success: true,
                        message: 'The user post is retrived ',
                        data: items
                    };
                    console.log("before sending")
                    res.json(content);
                    
                    
                }
            })
                                
            

        }
                
    })
            
    // });
});



//Get PostDetails for the particular postid
router.get('/postdetails/:postid', (req, res) =>{
    console.log("request",req.params);
    var idforpostdetails = new ObjectID(req.params.postid);
    console.log('the postid for which the postdetails to be taken',idforpostdetails)
    var details = { '_id': idforpostdetails };
    // connection((db) => {
    db.get().collection('posts').findOne(details, (err, item) =>{
        if (err){
            console.log("error is", err);
            console.log("error code is", err.code)
            let content = {
                success: false,
                message: 'There is a error in getting the post details'
            };
            res.json(content);
        } else {
            console.log("postdetails without error",item)
            tagNoArray = JSON.parse(item.tags)
            tag_words = []
            async.eachSeries(tagNoArray, function (tid, callback2) {
                console.log("inside async.each",tid)
                var name = {'_id':new ObjectID(tid)};
                console.log(name);
                // connection((db) => {
                console.log("inside connection")
                db.get().collection('tags').findOne(name, function(err, result) {
                    if (err) 
                        res.send(err);
                    else {
                        console.log("the record from tag table for given tagid",result)
                        tag_words.push(result.name)
                        console.log("the length of tag words is",tag_words.length)
                        callback2(null,tag_words)
                        

                    }
                })
                // })
            },function(err,data){
                if(err){
                    console.log(" i am in async err");
        
                }else{
                    // tagnames = JSON.stringify(tag_words);
                    tagnames = tag_words.toString()
                    console.log("the tagword's are", tagnames)
                    item.tags = tagnames
                    console.log("atlast the item is",item)
                    let content = {
                        success: true,
                        message: 'The post details is retrived',
                        data: item
                    };
                    res.json(content);
                    
                    
                    
                }
            })

            

        }
    })
    // })
})





// Get PostCount
router.get('/postcount/:id', (req, res) => {
    console.log("i am inside postcount app route")
    console.log("request",req.params);
    var idforpostcount = new ObjectID(req.params.id);
    console.log('the userid for which the postcount to be taken',idforpostcount)
    var details = { '_id': idforpostcount };
    // connection((db) => {
    db.get().collection('members').findOne(details, (err, item) =>{
        if (err){
            console.log("error is", err);
            console.log("error code is", err.code)
            let content = {
                success: false,
                message: 'There is a error in getting the post count'
            };
            res.json(content);

        } else {
            console.log("postcount without error",item)
            let content = {
                success: true,
                message: 'The post count is retrived',
                data: item
            };
            res.json(content);
            

        }
    })
            
    // });
});

// Add comments
router.post('/commentPost', (req, res) => {
    console.log(" i am inside commentpost route");
    var todo = req.body;
    console.log("the todo is", todo);
    // connection((db) => {
    db.get().collection('comments').save(todo, function(err, result) {
        if (err) {
            console.log("error is", err);
            console.log("error code is", err.code)
            let content = {
                success: false,
                message: 'There is a error in saving the comment'
                };
            res.json(content);
        } else {
            console.log("comment is saved");
            // console.log("result is",result)
            let content = {
                success: true,
                message: 'Your comment is saved'
            };
            res.json(content);
        }
    })
    // })

})


//Edit the Comment
router.post('/editComment', (req, res) => {
    console.log(" i am inside edit comment route");
    var todo = req.body;
    query = {_id: new ObjectID(todo.commentid)}
    newValues = { $set: {comment: todo.comment} }
    // connection((db) => {
    db.get().collection('comments').updateOne(query,newValues , function(err, result) {
        if (err) {
            console.log("error is", err);
            console.log("error code is", err.code)
            let content = {
                success: false,
                message: 'Your comment is not Updated'
            };
            res.json(content);


        }
        else{
            console.log("updated Your comment", result)
            let content = {
                success: true,
                message: 'Your comment is  Updated'
            };
            res.json(content);
        }
    });
    // }); 
    
    



})


// Edit Posts
router.post('/updatePost', (req, res) => {
    console.log(" i am inside updatepost route");
    var todo = req.body;
    console.log("the todo is", todo);
    console.log(typeof todo.tags);
    var tagarray = todo.tags.split(',');
    console.log("the length of tag array is",tagarray.length)
    var tag_value = [];

    async.each(tagarray, function (item, callback) {
        var name = {'name':item};
        console.log("query checking");
        console.log(name);
        // connection((db) => {
        db.get().collection('tags').findOne(name, function(err, result) {
            if (err) 
                res.send(err);
            console.log("result if already present or not",result)
            if( result == null ) {
                console.log("i am inside if");   
                db.get().collection('tags').save(name, function(err, result) {
                    if (err){
                        console.log("error in saving tags")
                    }else {
                        console.log("new tag added")
                        console.log(typeof result.ops)
                        console.log("^^^^^^^^^^^^^6",result.ops[0]._id)
                        tag_value.push(result.ops[0]._id)
                        callback(null,tag_value);
                    }    
                })   
            } else {
                console.log(" find null or not result&&&&&&&&&&&")
                console.log(result)
                console.log("%%%%%%%%%%%",result._id)
                tag_value.push(result._id)
                callback(null,tag_value);
            }
        })
        // }) 
        // callback(null,tag_value);
    },function(err,data){
        if(err){
            console.log(" i am in final err");

        }else{
            console.log("outside async each of update route",data)
            var tagids = JSON.stringify(tag_value);
            console.log("the tagid's are", tagids)
            todo.tags=tagids
            let content = {
                success: true,
                message: 'Your post is Updated'
              };
            
            var postIdToUpdate = new ObjectID(todo.postid);
            console.log('the objectid to be updated is',postIdToUpdate)
            var newvalues = { title: todo.title, description: todo.description,tags:todo.tags,userid:todo.userid};
            console.log("new values", newvalues)
            // connection((db) => {
            db.get().collection('posts').updateOne({ '_id': postIdToUpdate },newvalues , function(err, result) {
                if (err) {
                    console.log("error is", err);
                    console.log("error code is", err.code)
                    let content = {
                        success: false,
                        message: 'Your post is not Updated'
                    };
                    res.json(content);


                }
                else{
                    console.log("updated the post content")
                }
            });
            // }); 
            
            res.json(content);
        }



    })
})
// Add Posts
router.post('/addposts', (req, res) => {
    console.log(" i am inside addposts post route");
    var todo = req.body;
    console.log("the todo is", todo);
    console.log(typeof todo.tags);
    var tagarray = todo.tags.split(',');
    console.log("the length of tag array is",tagarray.length)
    var tag_value = [];
    
    async.each(tagarray, function (item, callback) {
        var name = {'name':item};
        console.log("query checking");
        console.log(name);
        // connection((db) => {
        db.get().collection('tags').findOne(name, function(err, result) {
            if (err) 
                res.send(err);
            console.log("result if already present or not",result)
            if( result == null ) {
                console.log("i am inside if");   
                db.get().collection('tags').save(name, function(err, result) {
                    if (err){
                        console.log("error in saving tags")
                    }else {
                        console.log("new tag added")
                        console.log(typeof result.ops)
                        console.log("^^^^^^^^^^^^^6",result.ops[0]._id)
                        tag_value.push(result.ops[0]._id)
                        callback(null,tag_value);
                    }    
                })   
            } else {
                console.log(" find null or not result&&&&&&&&&&&")
                console.log(result)
                console.log("%%%%%%%%%%%",result._id)
                tag_value.push(result._id)
                callback(null,tag_value);
            }
        })
        // }) 
        // callback(null,tag_value);
    },function(err,data){
        if(err){
            console.log(" i am in final err");

        }else{
            var tagids = JSON.stringify(tag_value);
            console.log("the tagid's are", tagids)
            todo.tags=tagids
            
            // connection((db) => {
            db.get().collection('posts').save(todo, function(err, result) {
                if (err) {
                    console.log("error is", err);
                    console.log("error code is", err.code)
                    let content = {
                        success: false,
                        message: 'There is a error in saving the post'
                        };
                    res.json(content);
                } else {
                    console.log("Post is saved");
                    console.log("result is",result)
                    let content = {
                        success: true,
                        message: 'Your post is saved'
                        };
                    
                    var idtoupdate = new ObjectID(result.ops[0].userid);
                    console.log('the objectid to be updated is',idtoupdate)
                    query = db.get().collection('members').update({ '_id': idtoupdate },{ $inc: { 'postcount': 1 } }, function(err, result) {
                        if (err) {
                            console.log("error is", err);
                            console.log("error code is", err.code)
                        }
                        else{
                            console.log("updated the postcount query result")
                        }
                    });  
                    console.log(query)
                    res.json(content);
                }
            })
            // });
    

        }
        
    });
    
    
});

// Register User
router.post('/adduser', function(req, res) {
    login_module.register(req,function(err, docs) {
      res.json(docs)
    })
})


// Check User
router.post('/checkuser', function(req, res) {
    login_module.login(req,function(err, docs) {
      res.json(docs)
    })
})



module.exports = router;