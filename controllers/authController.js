const User = require("../models/User");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const { error } = require("console");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "adisonstocks@gmail.com",
    password: "Salauddin01",
  },
});

const generateOTP = () => crypto.randomInt(100000, 999999).toString();

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User alredy exists" });
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    user = new User({
      name,
      email,
      password,
      otp,
      otpExpiry,
    });
    await user.save();
    await transporter.sendMail({
      from: "adisonstocks@gmail.com",
      to: email,
      subject: "OTP Verification",
      text: `Your OTP is: ${otp}`,
    });
    res
      .status(201)
      .json({ message: "user registered. please verify OTP sent to email" });
  } catch (err) {
    res.status(500).json({ message: "Error registering user", error });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({
        message: "User already verified",
      });
    if (user.otp !== otp || user.otpExpiry < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();
    res.json({ message: "Email verified successfully. You can now log in." });
  } catch (error) {
    res.status(500).json({ message: "Error verifying OTP", error });
  }
};

exports.resendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "User not found" });
    if (user.isVerified)
      return res.status(400).json({ message: "User already verified" });

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await transporter.sendMail({
      from: "adisonstocks@gmail.com",
      to: email,
      subject: "Resend OTP Verification",
      text: `Your new OTP is: ${otp}`,
    });

    res.json({ message: "OTP resent successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error resending OTP", error });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });
    if (user.password !== password)
      return res.status(400).json({ message: "Incorrect password" });

    if (!user.isVerified) {
      return res
        .status(400)
        .json({ message: "Email not verified. please verify OTP" });
    }
    req.session.user = { id: user._id, email: user.email, name: user.name };
    res.json({ message: "Login successful" });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
};

exports.logout = (req, res)=>{
    req.session.destroy((err)=>{
        if(err) return res.status(500).json({message: 'Error Logging out'});

        res.json({message: "Logged out successfully"})

    })
}

exports.dashboard = async (req, res)=>{
    res.json({message: `Welcome to the dashboard, ${req.session.user.name}`})
}
