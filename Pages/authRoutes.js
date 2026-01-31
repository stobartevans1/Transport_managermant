const express = require('express');
const router = express.Router();
const User = require('./../Model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); 

router.post('/register', async (req, res) => {
    try {
        const { name, gmail, mobile, password } = req.body;

        // 1. Check if user exists
        let userExists = await User.findOne({ $or: [{ gmail }, { mobile }] });
        if (userExists) return res.status(400).json({ msg: "User already exists" });

        // 2. Generate custom EMPID
        const userCount = await User.countDocuments();
        const generatedEmpId = `EMP-${1001 + userCount}`;

        // 3. Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4. Create and Save User
        const newUser = new User({
            empId: generatedEmpId,
            name,
            gmail,
            mobile,
            password: hashedPassword
        });

        const savedUser = await newUser.save();
        
        // Return the generated EMPID to the frontend
        res.status(201).json({ 
            msg: "Registration Successful", 
            empId: savedUser.empId 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



router.post('/login', async (req, res) => {
    try {
        const { mobile, password } = req.body;

        // 1. Check if user exists by mobile number
        const user = await User.findOne({ mobile });
        if (!user) {
            return res.status(400).json({ msg: "Invalid Mobile Number" });
        }

        // 2. Compare entered password with the hashed password in DB
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Invalid Password" });
        }

        // 3. Create a JWT Token (Expires in 1 day)
        // Use the secret key from your .env file
        const token = jwt.sign(
            { id: user._id, empId: user.empId }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1d' }
        );

        // 4. Return success, token, and user details (including the generated empId)
        res.status(200).json({
            msg: "Login Successful",
            token: token,
            user: {
                empId: user.empId,
                name: user.name,
                mobile: user.mobile
            }
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
module.exports = router;