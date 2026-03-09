const bcrypt = require("bcrypt");
const { User, validateLogin } = require("../models/userModel.js");

const loginController = async(req, res) => {
    try {

        const { error } = validateLogin(req.body);

        if (error) {
            return res.status(400).send({
                message: error.details[0].message
            });
        }

        const { email, password } = req.body;

        /* Find user */

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).send({
                message: "Invalid email or password"
            });
        }

        /* Check password */

        const validPassword = await bcrypt.compare(
            password,
            user.password
        );

        if (!validPassword) {
            return res.status(401).send({
                message: "Invalid email or password"
            });
        }

        /* Generate token */

        const token = user.generateAuthToken();

        /* Send response */

        res
            .status(200)
            .cookie("authToken", token, {
                httpOnly: true,
                sameSite: "none",
                secure: process.env.NODE_ENV === "production",
                maxAge: 7 * 24 * 60 * 60 * 1000
            })
            .send({
                message: "Login successful",
                token,
                user: {
                    _id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email
                }
            });

    } catch (error) {

        console.error("Error in loginController:", error);

        res.status(500).send({
            message: "Internal Server Error"
        });

    }
};

module.exports = loginController;