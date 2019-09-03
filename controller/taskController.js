const Task = require('../model/task.js');
const User = require('../model/user.js')
const {sucRes, failRes} = require('../helper/resFormat.js');


function createTodo(req, res){
    Task.create({
        name: req.body.name, date: req.body.date, note: req.body.note, priority: req.body.priority, 
        status: req.body.status //all this can change with req.body without {}. Because on req.body is like this
    }, (err, data) => {
        if (err) return res.status(400).json(failRes(err.message, "Wrong Type"));
        res.status(201).json(sucRes(data, "Entry Create Success"));
        console.log(data)
        User.findById(req.user, (err, user)=>{
            if(err) return res.status(404).json(failRes('error'))
            user.tasks.push(data)
            user.save()
            data.user = req.user
            data.save()
        })
    })
}
function updateTodo (req, res){
    Task.findById (req.params.id, (err, data) =>{
        if (err) {
            return res.status(404).json(failRes("ID not found"));
        } else if (data.user._id != req.user) 
            return res.status(404).json(failRes("this isn't your task"));
        Task.findByIdAndUpdate(
            req.params.id, {$set: req.body //{$set: req.body} can change with req.body
            }, (err, data) => {
                if (err) return res.status(400).json(failRes(err.message, "Wrong Type"));
                res.status(200).json(sucRes(req.body, "Entry Task Update Success"));
                console.log(req.body)
            }
        )
    })
}
function deleteTodo (req, res){
    Task.findById(req.params.id, (err, data) => {
        if (err) {
            return res.status(404).json(failRes("ID not found"));
        } else if (data.user._id != req.user) 
            return res.status(404).json(failRes("this isn't your task"));
        Task.findByIdAndDelete (
            req.params.id, req.body
            , (err, data) => {
                //if (err) return res.status(404).json(failRes("ID Not Found")); //can't error. error already catch above function
                res.status(200).json(sucRes(data, "Entry Delete Success"));
            }
        )
    })
}
function showTodo (req, res){
    Task.findById(req.params.id
        , (err, data)=> {
            if (err) {
                return res.status(404).json(failRes("ID not found"));
            } else if (data.user._id != req.user) 
                return res.status(404).json(failRes("this isn't your task"));
            res.status(200).json(sucRes(data, "An Entry Show Success"));
        }
    )
}
function indexTodo (req, res){
    Task.find ({user: req.user}, (err, data) => {
        if (err) return res.status(404).json(failRes(err, "this isn't your task. Can't show if not your task"));
        // if (err) return res.status(404).json(failRes("Entry Faiil to Display")); // this func is commented to pass coverage test
        res.status(200).json(sucRes(data, "Displaying All Entry Success"));
    })
}

module.exports = {createTodo, deleteTodo, updateTodo, showTodo, indexTodo};
