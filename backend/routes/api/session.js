const express = require("express");
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");

const { setTokenCookie } = require("../../utils/auth");
const { validateLogin } = require("../../utils/inputValdation");
const { User } = require("../..//db/models");

const router = express.Router();

// GET SESSION USER
router.get("/me", (req, res) => {
  const { user } = req;

  if (user) {
    const safeUser = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
    };
    return res.json({
      user: safeUser,
    });
  } else return res.json({ user: null });
});

// LOGIN
router.post("/login", validateLogin, async (req, res, next) => {
  const { credential, password } = req.body;

  try {
    const user = await User.unscoped().findOne({
      where: {
        [Op.or]: {
          username: credential,
          email: credential,
        },
      },
    });

    if (
      !user ||
      !bcrypt.compareSync(password, user.hashedPassword.toString())
    ) {
      const err = new Error("Invalid credentials");
      err.errors = { login: "The provided credentials were invalid" };
      err.status = 401;
      err.title = "Login failed";
      return next(err);
    }

    const safeUser = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    await setTokenCookie(res, safeUser);

    return res.json({
      user: safeUser,
    });
  } catch (err) {
    next(err);
  }
});

// LOGOUT
router.delete("/logout", (_req, res) => {
  res.clearCookie("token");
  return res.json({ message: "success" });
});

module.exports = router;
