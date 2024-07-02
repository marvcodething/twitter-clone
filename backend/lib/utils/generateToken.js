import jwt from 'jsonwebtoken';

export const generateTokenAndSetCookie = (userId, res) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn: '15d'}); // created a Token
    res.cookie('jwt', token, { //Sent token with cookie
        sameSite: "strict", // CSRF attacks
        maxAge: 15*24*60*60*1000, //MS
        httpOnly: true, // prevents XSS attacks
        secure: process.env.NODE_ENV !== 'development', // only send cookie over https in production
    });
}