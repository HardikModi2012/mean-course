const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const user = require('../models/user');
const router = express.Router();

router.post("/signup", (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        const user = new User({
            email: req.body.email,
            password: hash,
        });
        user.save()
        .then(result =>{
            res.status(201).json({
                message: 'User Created',
                result: result
            });
        })
        .catch(err => {
            res.status(400).json({
                error: err
            });
        })
    })
})

router.post("/login", (req, res, next) => {
    let fetchedUser;
   User.findOne({ email: req.body.email})
   .then(user => {
        if (!user) {
            return res.status(401).json({
                message: 'Auth failed',
                result: result 
            })
        }
        fetchedUser = user;
        return bcrypt.compare(req.body.password, user.password);
   })
   .then(result => {
    if (!result) {
        return res.status(401).json({
            message: 'Auth failed'
        })
    }
    const token = jwt.sign({email: fetchedUser.email, userId: fetchedUser._id}, 'secret_this_is_password', {expiresIn: '30m'});
    res.status(200).json({
        token: token
    })
   })
   .catch(err => {
    return res.status(401).json({
        message: 'Auth failed',
        result: err 
    })
   })
})


module.exports = router;