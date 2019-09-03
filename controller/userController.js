const User = require('../model/user.js')
const {sucRes, failRes} = require('../helper/resFormat.js')
const bcrypt = require('bcrypt')
const salRounds = 10
var jwt = require('jsonwebtoken')

function register(req, res){
    bcrypt.hash(req.body.password, salRounds, function(err, hash){
        User.create(
            {username: req.body.username, email: req.body.email, password: hash, tasks: req.body.tasks} //if use this can't use validate on model. the solution change with req.body. but can't hash password
        ,
        (err, data) => {
            if(err) return res.status(422).json(failRes(err.message, "please fill correctly"))
            res.status(201).json(sucRes(req.body, "Register Success")) //if use data not req.body, will show result data register after hash
        })
    })
}

function login(req, res){
    User.findOne({
        email: req.body.email
    }).then(function(user){
        //console.log(user)
        if(!user){
            res.status(401).json(failRes("email not match"))
        } else{
            bcrypt.compare(req.body.password, user.password, function(err, result){
                if(result == true){
                    console.log("result: " + result)
                    jwt.sign({_id: user._id}, "xyz", function(err, token){
                        if(err) return res.status(400).json("Wrong")
                        res.status(201).header('authorization', token).json({message: "Login Success", token}) //without respon formatter
                        console.log()
                    })
                } else {
                    res.send(failRes("Incorrect Password"))
                    console.log("result: " + result)
                }
            })
        }
    })
}

function show(req, res){
    //console.log(req.body)
    User.findById(req.user)
    .populate('task')
    .exec(function(err, data){
        if (err) return res.status(404).json(err)
        res.status(200).json(sucRes(data, "Below Your Data Account"))
        console.log(data)
    })
}

module.exports = {register, login, show}
