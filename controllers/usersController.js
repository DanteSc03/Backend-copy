const User = require('../model/UserSQL');  // Sequelize model

// Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();  // Fetch all users
        if (!users || users.length === 0) {
            return res.status(204).json({ 'message': 'No users found' });
        }
        res.json(users);
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}

// Delete a user by ID
const deleteUser = async (req, res) => {
    if (!req?.body?.id) {
        return res.status(400).json({ "message": 'User ID required' });
    }
    try {
        const user = await User.findByPk(req.body.id);  // Find user by primary key (ID)
        if (!user) {
            return res.status(204).json({ 'message': `User ID ${req.body.id} not found` });
        }
        const result = await user.destroy();  // Delete the user
        res.json({ 'message': `User ID ${req.body.id} deleted` });
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}

// Get a user by ID
const getUser = async (req, res) => {
    if (!req?.params?.id) {
        return res.status(400).json({ "message": 'User ID required' });
    }
    try {
        const user = await User.findByPk(req.params.id);  // Find user by primary key (ID)
        if (!user) {
            return res.status(204).json({ 'message': `User ID ${req.params.id} not found` });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}

// Get a user by username
const getUserByUsername = async (req, res) => {
    if (!req?.params?.username) {
        return res.status(400).json({ "message": 'Username required' });
    }
    try {
        // Find user by username
        const user = await User.findOne({ 
            where: { username: req.params.username }
        });

        if (!user) {
            return res.status(204).json({ 'message': `User with username ${req.params.username} not found` });
        }
        
        res.json({userId: user.userId});  // Send back the user data, including the userId
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
};


module.exports = {
    getAllUsers,
    deleteUser,
    getUser,
    getUserByUsername
}
