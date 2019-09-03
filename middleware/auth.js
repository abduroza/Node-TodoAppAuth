var jwt = require('jsonwebtoken')
var {sucRes, failRes} = require('../helper/resFormat.js')
const User = require('../model/user.js')

function auth(req, res, next){
    let bearerToken = req.headers.authorization
    if (!bearerToken) return res.status(401).json(failRes("Token Not Available"))
    let splitToken = bearerToken.split(" ")//only 2nd array will read
    try {
        jwt.verify(splitToken[1], 'xyz', function(err, decoded){
            //if(err) return res.status(400).json("fail token")
            req.user = decoded._id
            User.findById (
                req.user, (err, data) => {
                    if (!data) return res.status(404).json(failRes("User Not Found"))
                    //res.status(201).json(sucRes(data, "data ready"))// if use this, can cause crash due to re send to header again, but data suscess create 
                }
            )
            next()
        })
    } catch {
        res.status(400).json(failRes("Invalid Token"))
        
    }
}
module.exports = auth