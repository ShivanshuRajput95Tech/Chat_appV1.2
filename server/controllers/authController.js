const bcrypt = require("bcrypt");
const User = require("../models/User");

exports.register = async(req, res) => {

    try {

        const { firstName, lastName, email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(Number(process.env.SALT));

        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            emailVerified: false
        });

        await user.save();

        const secret = process.env.JWTPRIVATEKEY + user.password;

        const token = jwt.sign({ _id: user._id }, secret, { expiresIn: '1h' });

        res.status(201).json({ message: "User registered successfully. Please verify your email.", verificationLink: `http://localhost:5173/verify/${user._id}/${token}` });

    } catch (error) {

        res.status(500).json({ message: "Server error" });

    }

};
exports.login = async(req, res) => {

    try {

        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const validPassword = await bcrypt.compare(
            password,
            user.password
        );

        if (!validPassword) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const token = user.generateAuthToken();

        res.cookie("authToken", token, {
            httpOnly: true,
            sameSite: "lax"
        });

        res.json({ message: "Login successful", token, user: { _id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName } });

    } catch (error) {

        res.status(500).json({ message: "Server error" });

    }

};

exports.verifyEmail = async(req, res) => {

    try {

        const { id, token } = req.params;

        const user = await User.findById(id);

        if (!user) {
            return res.status(400).json({ message: "Invalid link" });
        }

        const secret = process.env.JWTPRIVATEKEY + user.password;

        jwt.verify(token, secret);

        user.emailVerified = true;

        await user.save();

        const authToken = user.generateAuthToken();

        res.json({ message: "Email verified successfully", token: authToken, user: { _id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName } });

    } catch (error) {

        res.status(400).json({ message: "Invalid or expired link" });

    }

};