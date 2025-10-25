router.get("/logout", (req, res) => {
  res.clearCookie("jwt");
  req.flash("success_msg", "You have been logged out successfully.");
  res.redirect("/");
});
