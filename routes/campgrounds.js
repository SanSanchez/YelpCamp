const express   = require("express"),
    router      = express.Router(),
    nodeGeocoder    = require('node-geocoder'),
    middleware  = require("../middleware"),
    Campground  = require("../models/campground");

geocoder = nodeGeocoder({
    provider: "google",
    httpAdapter: "https",
    apiKey: process.env.GEOCODER_API_KEY,
    formatter: null
});

// Index Route
router.get("/", (req, res) => {
    let perPage = 8,
        pageQuery = parseInt(req.query.page),
        pageNumber = pageQuery ? PageQuery : 1;

    Campground.find({}).skip((perPage * pageNumber) - perPage).limit(perPage).exec( (err, allCampgrounds) => {
        Campground.count().exec( (err, count) => {
            if (err) {
                console.log("Error in loading /campgrounds");
                res.redirect("/campgrounds");
            } else {
                res.render("campgrounds/index", {
                    campgrounds: allCampgrounds,
                    current: pageNumber,
                    pages: Math.ceil(count / perPage)
                });
            }
        });
    });
});

router.post("/", middleware.isLoggedIn, (req, res) => {
    geocoder.geocode(req.body.campground.location, (err, data) => {
        if (err || !data.length) {
            req.flash('error', 'Invalid address');
            console.log(err);
            return res.redirect('back');
        }
        let newCampground = {
            name: req.body.campground.name,
            image: req.body.campground.image,
            description: req.body.campground.description,
            price: req.body.campground.price,
            author: {
                id: req.user._id,
                username: req.user.username
            },
            lat: data[0].latitude,
            lng: data[0].longitude,
            location: data[0].formattedAddress
        };
        Campground.create(newCampground, (err, newlyCreated) => {
            if(err){
                console.log(err);
            } else {
                //redirect back to campgrounds page
                console.log(newlyCreated);
                res.redirect("/campgrounds");
            }
        });
    });
});

// New Campground Route
router.get("/new", middleware.isLoggedIn, (req, res) => {
    res.render("campgrounds/new");
});

// Show Route
router.get("/:id", (req, res) => {
    Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
        if (err) {
            console.log(err);
            console.log("Error in loading /campgrounds/id");
            res.redirect("/campgrounds");
        } else {
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

// Edit Route
router.get("/:id/edit", middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});


// Update Route
router.put("/:id", middleware.checkCampgroundOwnership, (req, res) => {
    geocoder.geocode(req.body.campground.location, (err, data) => {
        if (err || !data.length) {
            // req.flash('error', 'Invalid address');
            // console.log(err);
            console.log(req.body.campground.location);
            console.log(data);
            return res.redirect('back');
        }

        req.body.campground.lat = data[0].latitude;
        req.body.campground.lng = data[0].longitude;
        req.body.campground.location = data[0].formattedAddress;

        Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, campground) => {
            if(err){
                req.flash("error", err.message);
                res.redirect("back");
            } else {
                req.flash("success","Successfully Updated!");
                res.redirect("/campgrounds/" + campground._id);
            }
        });
    });
});

// Destroy Route
router.delete("/:id", middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndRemove(req.params.id, (err) => {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});


module.exports = router;