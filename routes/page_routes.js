const express = require("express");
const passport = require("passport");
const router = express.Router();

const {
  render_index,
  render_sign_up,
  render_restricted,
  sign_up,
  log_out,
} = require("../controllers/page_controller");

router.route("/").get(render_index);
router.route("/sign-up").get(render_sign_up).post(sign_up);
router.route("/log-in").post(
  passport.authenticate("local", {
    successRedirect: "/manga",
    failureRedirect: "/",
    failureMessage: true,
  })
);
router.route("/restricted").get(render_restricted);
router.route("/log-out").get(log_out);

module.exports = router;