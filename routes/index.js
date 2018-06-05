const express   = require("express"),
    router      = express.Router(),
    passport    = require("passport"),
    User        = require("../models/user"),
    Campground  = require("../models/campground");

// TODO: Make it so that when a user logs in they are redirected back to the page they were on with the new information loaded.
// TODO: When a user registers they should automatically login as well with the new information provided.
router.get("/", (req, res) => {
    res.render("landing");
});

router.get("/register", (req, res) => {
    res.render("register", {page: "register"});
});

router.post("/register", (req, res) => {
    let newUser = new User({
        username: req.body.username,
        email: req.body.email,
        firstName: req.body.fName,
        lastName: req.body.lName,
        avatar: req.body.avatar
    });
    User.register(newUser, req.body.password, (err) => {
        if (err) {
            console.log(err);
            return res.render("register", {error: err.message});
        }
        passport.authenticate("local")(req, res, () => {
            req.flash("success", "Welcome to YelpCamp");
            res.redirect("/campgrounds");
        });
    });
});

router.get("/login", (req, res) => {
    res.render("login", {page: "login"});
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}));

router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "Successfully Logged Out");
    res.redirect("/campgrounds");
});

// User Profile
router.get("/users/:id", (req, res) => {
    User.findById(req.params.id, (err, foundUser) => {
       if (err) {
           req.flash("error", "Something went wrong");
           res.redirect("/campgrounds");
       } else {
           Campground.find().where("author.id").equals(foundUser._id).exec((err, campgrounds) => {
               if (err) {
                   req.flash("error", "Something went wrong");
                   res.redirect("/campgrounds");
               } else {
                   res.render("users/show", {user: foundUser, campgrunds: campgrounds});
               }
           });
       }
    });
});

module.exports = router;