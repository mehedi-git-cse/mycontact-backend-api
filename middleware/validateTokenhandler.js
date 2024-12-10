const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");

const validateToken = asyncHandler(async (req, res, next) => {
    let token;
    const authHeader = req.headers.Authorization || req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer")) {
        token = authHeader.split(" ")[1];

        jwt.verify(token, process.env.ACCESS_TOKEN_SECERT, async(err, decoded) => {

            if (err) {
                res.status(401);
                throw new Error("User is not authorizes.");
            }

            req.user = decoded.user;

            if(req.user){
                const userAvailable = await User.findOne({
                    where: {
                      email: req.user.email,
                    },
                  });
              
                if (userAvailable.length < 1) {
                    res.status(401);
                    throw new Error("User is not authorizes.");
                } else {

                    if(userAvailable.name != req.user.name || userAvailable.email != req.user.email){
                        res.status(401);
                        throw new Error("User email or name not authorizes.");
                    }

                }
            }
            next();

        });

    } else {
        const error = new Error("Token Not found.");
        res.status(400);
        return next(error);
    }

});

module.exports = validateToken;