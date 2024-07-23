import bcrypt from "bcryptjs";
import User from '../models/user.model.js';
import generateTokenAndSetCookie from "../utils/generateToken.js";

export const signup = async (req, res) => {
    try {
        const { fullName, username, password, confirmPassword, gender } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Mali imong password choiii" });
        }

        const user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ error: "Naa na ang username" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

        const newUser = new User({
            fullName,
            username,
            password: hashedPassword,
            gender,
            profilePic: gender === "male" ? boyProfilePic : girlProfilePic
        });

        await newUser.save();

        // Generate JWT token and set cookie here
        generateTokenAndSetCookie(newUser._id, res);

        // Send response once
        res.status(201).json({
            _id: newUser._id,
            fullname: newUser.fullName,
            username: newUser.username,
            profilePic: newUser.profilePic
        });

    } catch (error) {
        console.error("Error sa signup controller", error.message);
        res.status(500).json({ error: "Internal Error parekoy!" });
    }
};

export const login = (req, res) => {
    console.log("Login user ni");
};

export const logout = (req, res) => {
    console.log("Logout user ni");
};
