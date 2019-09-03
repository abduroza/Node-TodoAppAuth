process.env.NODE_ENV = 'test';
const server = require ('../server.js');
const chai = require('chai');
const chaiHttp = require('chai-http');
const Task = require ('../model/task.js')
const should = chai.should();

chai.use(chaiHttp);

//positive test
describe('/GET root path', () => {
    it ("should return true in root path", (done) => {
        chai.request(server).get('/').end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.an('object');
            res.body.should.have.property('success').equal(true);
            res.body.should.have.property('messages').equal("Welcome to ToDo API");
            done();
        })
    })
})

describe('/GET all task', () => {
    it ("should show all task", (done) => {
        chai.request(server).get('/api/task/index').end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.an('object')
            done();
        })
    })
})

describe('/GET/:id a task', () => {
    it ("should show one task based on ID", (done) => {
        let task = new Task({
            name: "liburan",
            date: 2019-08-31,
            note: "kemana aja",
            priority: "low",
            status: false
        })
        task.save((err, task) => {
            chai.request(server)
            .get('/api/task/show/' + task._id)
            .end((err, res) => {
                console.log(task)
                //res.should.have.status(200); // if use this, must be define "let should=chai.should()"
                //res.body.should.be.an('object')
                chai.expect(res).to.have.status(200)
                done();
            })
        })
    })
})

describe('/POST a new task', () => {
    it ("should post new a task", (done) => {
        let task = {
            name: "makan bareng",
            date: 2019-08-28,
            note: "di taman rusun",
            priority: "medium",
            status: false
        }
        chai.request(server)
        .post('/api/task/create/')
        .send(task)
        .end((err, res) => {
            chai.expect(res).to.have.status(201)
            done();
        })
    })
})

describe('/PUT/:id a task based on ID', () => {
    it ("should uodate a task bases on ID", (done) => {
        let task = new Task ({
            name: "makan bareng",
            date: 2019-08-28,
            note: "di ruko glints",
            priority: "low",
            status: true
        })
        task.save((err, task) => {
            chai.request(server)
            .put('/api/task/update/' + task._id)
            .send({
                name: "makan bareng",
                date: 2019-08-28,
                note: "di taman rusun",
                priority: "medium",
                status: false
            })
            .end((err, res) => {
                if (err){
                    console.log(err)
                }
                res.should.have.status(200);
                res.body.should.be.an('object')
                // chai.expect(res).to.have.status(200) // bisa juga pakai ini. tapi 2 baris diatasnya ini harus dihapus
                done();
            })
        })
    })
})


describe('/DELETE/:id a task', () => {
    it ("should delete a task given the id", (done) => {
        let task = new Task ({
            name: "jogging",
            date: 2019-08-29,
            note: "di taman rusun",
            priority: "medium",
            status: false
        })
        task.save((err, task) => {
            chai.request(server)
            .delete('/api/task/delete/' + task._id)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.an('object')
                done();
            })
        })
    })
})

//negative test
describe('/GET endpoint error message', () => {
    it ("should show message url not found if wrong enter endpoint", (done) => {
        chai.request(server).get('/api/todaytask').end((err, res) => {
            res.should.have.status(404);
            res.body.should.be.an('object');
            done();
        })
    })
})

describe('/GET/:id a task', () => {
    it ("should show one task based on ID", (done) => {
            chai.request(server)
            .get('/api/task/show/jihoioosdgsfd75')
            .end((err, res) => {
                chai.expect(res).to.have.status(404)
                done();
            })
    })
})

describe('/POST a new task', () => {
    it ("should post new a task", (done) => {
        let task = {
            name: "makan bareng",
            date: 2019-08-28,
            note: "di taman rusun",
            priority: "menengah",
            status: false
        }
        chai.request(server)
        .post('/api/task/create/')
        .send(task)
        .end((err, res) => {
            chai.expect(res).to.have.status(404)
            done();
        })
    })
})

describe('/PUT/:id a task based on ID', () => {
    it ("should update a task bases on ID", (done) => {
            chai.request(server)
            .put('/api/task/update/hsdjbfuiadjfb89wra7uwehf')
            .send({
                name: "makan bareng",
                date: 2019-08-28,
                note: "di taman rusun",
                priority: "menengah",
                status: false
            })
            .end((err, res) => {
                res.should.have.status(404);
                res.body.should.be.an('object')
                done();
            })
    })
})

describe('/DELETE/:id a task', () => {
    it ("should delete a task given the id", (done) => {
            chai.request(server)
            .delete('/api/task/delete/kjg78stfusgdjf8vujf8y')
            .end((err, res) => {
                res.should.have.status(404);
                res.body.should.be.an('object')
                done();
            })
    })
})

