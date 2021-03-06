var DevGround = require("../models/devGround.js"),
   Comment = require("../models/comment.js"),
   middleware = require("../middleware");

var comments = {
   //UPDATE - Send updated comment to DB
   update: function (req, res) {
      Comment.findByIdAndUpdate(req.params.commentID, req.body.comment, function (err, comment) {
         if (err || !comment) {
            console.log(err);
            req.flash("danger", "There has been a problem");
            res.redirect("back");
         } else {
            req.flash("success", "Comment Updated");
            res.redirect("/devgrounds/" + req.params.id);
         }
      });
   },
   //DELETE - delete a comment in the DB
   delete: function (req, res) {
      Comment.findByIdAndRemove(req.params.commentID, function (err, comment) {
         if (err || !comment) {
            console.log(err);
            req.flash("danger", "There has been a problem");
            res.redirect("back");
         } else {
            req.flash("success", "Comment Deleted")
            res.redirect("/devgrounds/" + req.params.id);
         }
      });
   },
   // CREATE - adds new comment data to DB
   create: function (req, res) {
      // Search comment's devGround to reference them
      DevGround.findById(req.params.id, function (err, devGround) {
         if (err || !devGround) {
            console.log(err);
            req.flash("danger", "There has been a problem");
            res.redirect("back");
         } else {
            Comment.create(req.body.comment, function (err, comment) {
               if (err) {
                  comment.log(err);
               } else {
                  comment.author.id = req.user._id;
                  comment.author.username = req.user.username;
                  comment.save();
                  devGround.comments.push(comment._id);
                  devGround.save();
                  res.redirect("/devgrounds/" + devGround._id);
               }
            });
         }
      });
   }
}
module.exports = comments;