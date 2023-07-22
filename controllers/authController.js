const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const db = require('../models/index');
const User = db.User;

/**
 * @route POST /api/v1/auth/login 
 * @desc login api
 */
const login = asyncHandler( async (req, res) => {
    try {
        const { email, password, type } = req.body;
        if( !email || !password ) {
            res.status(400);
            throw new Error('Email and password is mandatory');
        }
        let user = await User.findOne({
            where: {
                email: email,
                user_type: type
            }
        });
        if( user && await bcrypt.compare(password, user.password) ) {
            const accessToken = jwt.sign({
                user: {
                    email: user.email,
                    user_type: user.user_type,
                    id: user.id
                }
            },
            process.env.JWT_ACCESS_TOKEN,
            { expiresIn: Math.floor(Date.now() / 1000) + (60 * 60) }
            );
            
            user.setDataValue('password', null);
            user.access_token = accessToken;
            res.status(200).json({ status: true, message: 'Login Successfull', data: user });
        } else {
            res.status(401);
            throw new Error('Email or Password is wrong');
        }
    } catch(err) {
        throw new Error(err);
    }
});

/**
 * @route POST /api/v1/auth/change-password
 * @desc change password api
 */
const changePassword = asyncHandler(async (req, res) => {
    try {
        const { current_password, new_password, cnew_password } = req.body;
        if( !current_password || !new_password || !cnew_password ) {
            res.status(400);
            if( !current_password ) {
                throw new Error('Current password is mandatory');
            }
            if( !new_password ) {
                throw new Error('New password is mandatory');
            }
            if( !cnew_password ) {
                throw new Error('Confirm password is mandatory');
            }
        }
        const checkPassword = await User.findOne({
            attributes: ['password'],
            where: {
                id: req.user.id
            }
        });
        if( checkPassword && await bcrypt.compare(current_password, checkPassword.password) ) {
            if( new_password.length  < 10 ) {
                res.status(400);
                throw new Error('New password length should not be less than 10 characters');
            }
            if( new_password !== cnew_password ) {
                res.status(400);
                throw new Error('New and Confirm password does not match');
            }
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(new_password, saltRounds);
            const updatePassword = await User.update({ password: hashedPassword }, {
                where: {
                    id: req.user.id
                }
            });
            res.status(200).json({ status: true, message: 'Password changed successfully', data: updatePassword })
        } else {
            res.status(400);
            throw new Error('Current password is wrong');
        }
    } catch(err) {
        throw new Error(err);
    }
});

module.exports = { login, changePassword }