const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Token = require("../models/tokenModel");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

// Generate Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// Register User
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Validation
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please fill in all required fields");
  }
  if (password.length < 6) {
    res.status(400);
    throw new Error("Password must be up to 6 characters");
  }

  // Check if user email already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("Email has already been registered");
  }

  // Create new user
  const user = await User.create({
    name,
    email,
    password,
  });

  //   Generate Token
  const token = generateToken(user._id);

  // Send HTTP-only cookie
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400), // 1 day
    sameSite: "none",
    secure: true,
  });

  if (user) {
    const { _id, name, email, photo, phone, bio } = user;
    res.status(201).json({
      _id,
      name,
      email,
      photo,
      phone,
      bio,
      token,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// Login User
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate Request
  if (!email || !password) {
    res.status(400);
    throw new Error("Please add email and password");
  }

  // Check if user exists
  const user = await User.findOne({ email });

  if (!user) {
    res.status(400);
    throw new Error("User not found, please signup");
  }

  // User exists, check if password is correct
  const passwordIsCorrect = await bcrypt.compare(password, user.password);

  //   Generate Token
  const token = generateToken(user._id);

  // Send HTTP-only cookie
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400), // 1 day
    sameSite: "none",
    secure: true,
  });

  if (user && passwordIsCorrect) {
    const { _id, name, email, photo, phone, bio } = user;
    res.status(200).json({
      _id,
      name,
      email,
      photo,
      phone,
      bio,
      token,
    });
  } else {
    res.status(400);
    throw new Error("Invalid email or password");
  }
});

// Logout User
const logout = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0),
    sameSite: "none",
    secure: true,
  });
  return res.status(200).json({ message: "Successfully Logged Out" });
});

// Get User Data
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    const { _id, name, email, photo, phone, bio } = user;
    res.status(200).json({
      _id,
      name,
      email,
      photo,
      phone,
      bio,
    });
  } else {
    res.status(400);
    throw new Error("User Not Found");
  }
});

// Get Login Status
const loginStatus = asyncHandler(async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json(false);
  }
  // Verify Token
  const verified = jwt.verify(token, process.env.JWT_SECRET);
  if (verified) {
    return res.json(true);
  }
  return res.json(false);
});

// Update User
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    const { name, email, photo, phone, bio } = user;
    user.email = email;
    user.name = req.body.name || name;
    user.phone = req.body.phone || phone;
    user.bio = req.body.bio || bio;
    user.photo = req.body.photo || photo;

    const updatedUser = await user.save();
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      photo: updatedUser.photo,
      phone: updatedUser.phone,
      bio: updatedUser.bio,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const changePassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { oldPassword, password } = req.body;

  if (!user) {
    res.status(400);
    throw new Error("User not found, please signup");
  }
  //Validate
  if (!oldPassword || !password) {
    res.status(400);
    throw new Error("Please add old and new password");
  }

  // check if old password matches password in DB
  const passwordIsCorrect = await bcrypt.compare(oldPassword, user.password);

  // Save new password
  if (user && passwordIsCorrect) {
    user.password = password;
    await user.save();
    res.status(200).send("Password change successful");
  } else {
    res.status(400);
    throw new Error("Old password is incorrect");
  }
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error("User does not exist");
  }

  // Delete token if it exists in DB
  let token = await Token.findOne({ userId: user._id });
  if (token) {
    await token.deleteOne();
  }

  // Create Reset Token
  let resetToken = crypto.randomBytes(32).toString("hex") + user._id;
  console.log(resetToken);

  // Hash token before saving to DB
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Save Token to DB
  await new Token({
    userId: user._id,
    token: hashedToken,
    createdAt: Date.now(),
    expiresAt: Date.now() + 05 * (60 * 1000), // five minutes
  }).save();

  // Construct Reset Url
  const resetUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;

  // Reset Email
  const message = `
  <body link="#4a7eb6" vlink="#4a7eb6" alink="#4a7eb6">
  <style>
    @media only screen and (max-width: 600px) {
      .main {
        width: 320px !important;
      }

      .top-image {
        width: 100% !important;
      }
      .inside-footer {
        width: 320px !important;
      }
      table[class="contenttable"] {
        width: 320px !important;
        text-align: left !important;
      }
      td[class="force-col"] {
        display: block !important;
      }
      td[class="rm-col"] {
        display: none !important;
      }
      .mt {
        margin-top: 15px !important;
      }
      *[class].width300 {
        width: 255px !important;
      }
      *[class].block {
        display: block !important;
      }
      *[class].blockcol {
        display: none !important;
      }
      .emailButton {
        width: 100% !important;
      }

      .emailButton a {
        display: block !important;
        font-size: 18px !important;
      }
    }
  </style>

  <table
    class="main contenttable"
    align="center"
    style="
      font-weight: normal;
      border-collapse: collapse;
      border: 0;
      margin-left: auto;
      margin-right: auto;
      padding: 0;
      font-family: Arial, sans-serif;
      color: #555559;
      background-color: white;
      font-size: 16px;
      line-height: 26px;
      width: 600px;
    "
  >
    <tr>
      <td
        class="border"
        style="
          border-collapse: collapse;
          border: 1px solid #eeeff0;
          margin: 0;
          padding: 0;
          -webkit-text-size-adjust: none;
          color: #555559;
          font-family: Arial, sans-serif;
          font-size: 16px;
          line-height: 26px;
        "
      >
        <table
          style="
            font-weight: normal;
            border-collapse: collapse;
            border: 0;
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
          "
        >
          <tr>
            <td
              valign="top"
              class="side title"
              style="
                border-collapse: collapse;
                border: 0;
                margin: 0;
                padding: 20px;
                -webkit-text-size-adjust: none;
                color: #555559;
                font-family: Arial, sans-serif;
                font-size: 16px;
                line-height: 26px;
                vertical-align: top;
                background-color: white;
                border-top: none;
              "
            >
              <table
                style="
                  font-weight: normal;
                  border-collapse: collapse;
                  border: 0;
                  margin: 0;
                  padding: 0;
                  font-family: Arial, sans-serif;
                "
              >
                <tr></tr>
                <tr>
                  <td
                    class="top-padding"
                    style="
                      border-collapse: collapse;
                      border: 0;
                      margin: 0;
                      padding: 5px;
                      -webkit-text-size-adjust: none;
                      color: #555559;
                      font-family: Arial, sans-serif;
                      font-size: 16px;
                      line-height: 26px;
                    "
                  ></td>
                </tr>
                <tr>
                  <td
                    class="grey-block"
                    style="
                      border-collapse: collapse;
                      border: 0;
                      margin: 0;
                      -webkit-text-size-adjust: none;
                      color: #555559;
                      font-family: Arial, sans-serif;
                      font-size: 16px;
                      line-height: 26px;
                      background-color: #fff;
                      text-align: center;
                    "
                  >
                    <div class="mktEditable" id="cta">
                      <img
                        class="top-image"
                        src="https://res.cloudinary.com/img-api-pager-2/image/upload/v1667612088/Noted/logo_cqd6pf.png"
                        width="600"
                        height="300"
                      /><br />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td
                    class="top-padding"
                    style="
                      border-collapse: collapse;
                      border: 0;
                      margin: 0;
                      padding: 15px 0;
                      -webkit-text-size-adjust: none;
                      color: #555559;
                      font-family: Arial, sans-serif;
                      font-size: 16px;
                      line-height: 21px;
                    "
                  >
                    <hr size="1" color="#eeeff0" />
                  </td>
                </tr>
                <tr>
                  <td
                    class="text"
                    style="
                      border-collapse: collapse;
                      border: 0;
                      margin: 0;
                      padding: 0;
                      -webkit-text-size-adjust: none;
                      color: #555559;
                      font-family: Arial, sans-serif;
                      font-size: 16px;
                      line-height: 26px;
                    "
                  >
                    <div class="mktEditable" id="main_text">
                      <h1>Hello ${user.name},</h1>
                      <p>
                        We have received a password reset request from your
                        account. If this is an error please ignore.
                      </p>

                      <a
                        href="${resetUrl}"
                        clicktracking="off"
                        style="
                          color: #ffffff;
                          background-color: #4a7eb6;
                          border: 10px solid #4a7eb6;
                          border-radius: 3px;
                          text-decoration: none;
                        "
                        >Reset Password</a
                      >
                      <br />
                      <br />

                      <div>Notice: This link expire in 5 minutes</div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td
                    style="
                      border-collapse: collapse;
                      border: 0;
                      margin: 0;
                      padding: 0;
                      -webkit-text-size-adjust: none;
                      color: #555559;
                      font-family: Arial, sans-serif;
                      font-size: 16px;
                      line-height: 24px;
                    "
                  >
                    &nbsp;<br />
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td
              style="
                padding: 20px;
                font-family: Arial, sans-serif;
                -webkit-text-size-adjust: none;
              "
              align="center"
            >
              <table>
                <tr>
                  <td
                    align="center"
                    style="
                      font-family: Arial, sans-serif;
                      -webkit-text-size-adjust: none;
                      font-size: 16px;
                    "
                  >
                    <a
                      style="color: #4a7eb6"
                      href="{{system.forwardToFriendLink}}"
                      >Forward this Email</a
                    >
                    <br /><span
                      style="
                        font-size: 10px;
                        font-family: Arial, sans-serif;
                        -webkit-text-size-adjust: none;
                      "
                      >Please only forward this email to those who it may
                      concern; do not share your password with anyone who may
                      use it for malicious purposes.</span
                    >
                  </td>
                </tr>
              </table>
              <br />
              <table>
                <tr>
                  <td
                    align="center"
                    style="
                      font-family: Arial, sans-serif;
                      -webkit-text-size-adjust: none;
                      font-size: 8px;
                      text-decoration: none;
                    "
                  >
                    <a style="color: #8c8f91" href="/">
                      &#x2810;Terms & Conditions&#10256;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td
              style="
                border-collapse: collapse;
                border: 0;
                margin: 0;
                padding: 0;
                -webkit-text-size-adjust: none;
                color: #555559;
                font-family: Arial, sans-serif;
                font-size: 16px;
                line-height: 24px;
                padding: 20px;
              "
            >
              <div class="mktEditable" id="cta_try">
                <table
                  border="0"
                  cellpadding="0"
                  cellspacing="0"
                  class="mobile"
                  style="
                    font-weight: normal;
                    border-collapse: collapse;
                    border: 0;
                    margin: 0;
                    padding: 0;
                    font-family: Arial, sans-serif;
                  "
                >
                  <tr>
                    <td
                      class="force-col"
                      valign="top"
                      style="
                        border-collapse: collapse;
                        border: 0;
                        margin: 0;
                        padding: 0;
                        -webkit-text-size-adjust: none;
                        color: #555559;
                        font-family: Arial, sans-serif;
                        font-size: 16px;
                        line-height: 24px;
                      "
                    ></td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>
          <tr></tr>
        </table>
      </td>
    </tr>
  </table>
</body>


  `;
  const subject = "Password Reset Request";
  const send_to = user.email;
  const sent_from = process.env.EMAIL_USER;

  try {
    await sendEmail(subject, message, send_to, sent_from);
    res.status(200).json({ success: true, message: "Reset Email Sent" });
  } catch (error) {
    res.status(500);
    throw new Error("Email not sent, please try again");
  }
});

// Reset Password
const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { resetToken } = req.params;

  // Hash token, then compare to Token in DB
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // fIND tOKEN in DB
  const userToken = await Token.findOne({
    token: hashedToken,
    expiresAt: { $gt: Date.now() },
  });
  if (!userToken) {
    res.status(404);
    throw new Error("Invalid or Expired Token");
  }

  // Find user
  const user = await User.findOne({ _id: userToken.userId });
  user.password = password;
  await user.save();
  res.status(200).json({
    message: "Password Reset Successful, Please Login",
  });
});

module.exports = {
  registerUser,
  loginUser,
  logout,
  getUser,
  loginStatus,
  updateUser,
  changePassword,
  forgotPassword,
  resetPassword,
};
