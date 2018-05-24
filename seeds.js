"use strict";
const mongoose = require("mongoose"),
    Campground = require("./models/campground"),
    Comment    = require("./models/comment"),
    User       = require("./models/user");

const data = [
    {
        name: "Cloud's Rest",
        image: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "Desert Mesa",
        image: "https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "Canyon Floor",
        image: "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    }
];

// Export seedDB function.
module.exports = seedDB;

function seedDB() {
    // Remove Current Campgrounds from DB.
    removeCampgrounds();
    removeUsers();

    // Add new Campgrounds from data array.
    // populateCampgrounds();
}

let removeCampgrounds = () => {
    Campground.remove({}, err => {
        if (err) {
            console.log("Failed to remove campgrounds");
            return;
        }

        console.log("Removed Campgrounds.");
    });
};

let removeUsers = () => {
    User.remove({}, err => {
        if (err) {
            console.log("Failed to remove user");
            return;
        }

        console.log("Removed Users.");
    });

};

let populateCampgrounds = () => {
    data.forEach((seed) => {
        Campground.create(seed, (err, campground) => {
            if (err) {
                console.log(err);
                console.log("Error in creating campground.");
            } else {
                console.log("\tAdded a campground.");
                // populateComments(campground);
            }
        });
    });
};

let populateComments = (campground) => {
    Comment.create({
        text: "This place is great, but I wish there was internet",
        author: "Homer"
    }, (err, comment) => {
        if (err) {
            console.log(err);
            console.log("Error in adding comments.");
        } else {
            campground.comments.push(comment);
            campground.save();
            console.log("\t\tAdded Comments");
        }
    });
};