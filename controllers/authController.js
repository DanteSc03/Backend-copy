const User = require('../model/UserSQL'); // Ensure this uses Sequelize
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const handleLogin = async (req, res) => {
    const { user, pwd } = req.body;
    if (!user || !pwd) return res.status(400).json({ 'message': 'Username and password are required.' });

    try{
        // Find the user by username (assuming "username" is the column in your User model)
        const foundUser = await User.findOne({ where: { username: user } });
        if (!foundUser) return res.sendStatus(401); // unauthorized
        // Evaluate password
        const match = await bcrypt.compare(pwd, foundUser.password);
        if (match) {
            const roles = foundUser.roles;
            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "username": foundUser.username,
                        "roles": roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '5m' }
            );
            const refreshToken = jwt.sign(
                { "username": foundUser.username },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: '1d' }
            );
            // Saving refresh token with current user
            foundUser.refreshToken = refreshToken;
            const result = await foundUser.save(); // Save the updated user record

            console.log(result);
            console.log(roles);

            // Set refresh token in an HTTP-only cookie
            res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 }); // secure: true
            res.json({ roles, accessToken });
        } else {
            res.sendStatus(401);
        }
    } catch(error) {
        console.error('Error during user login:', error);
        res.status(500).json({'message': error.message});
    }
};

module.exports = { handleLogin };
