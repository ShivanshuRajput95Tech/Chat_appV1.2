const bcrypt = require("bcrypt");
const { User, validateRegister } = require("../models/userModel");

const registerController = async(req, res) => {

    try {

        const { error } = validateRegister(req.body);

        if (error) {
            return res.status(400).json({
                message: error.details[0].message
            });
        }

        const { firstName, lastName, email, password } = req.body;

        /* Check existing user */

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                message: "User with this email already exists"
            });
        }

        /* Hash password */

        const saltRounds = Number(process.env.SALT) || 10;

        const salt = await bcrypt.genSalt(saltRounds);

        const hashedPassword = await bcrypt.hash(password, salt);

        /* Create user */

        const user = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword
        });

        await user.save();

        res.status(201).json({
            message: "User registered successfully",
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            }
        });

    } catch (error) {

        console.error("Error in registerController:", error);

        res.status(500).json({
            message: "Internal Server Error"
        });

    }

};

module.exports = registerController;