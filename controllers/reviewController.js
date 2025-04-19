import Review from "../models/review.js";

export function getAllReviews(req, res) {
    Review.find({ isHidden: false })
        .then(reviews => {
            res.json(reviews);
        })
        .catch(err => {
            res.status(500).json({ message: "Failed to get reviews", error: err });
        });
}

export function createReview(req, res) {
    const review = new Review({
        productId: req.body.productId,
        userId: req.body.userId,
        rating: req.body.rating,
        comment: req.body.comment
    });

    review.save()
        .then(() => {
            res.json({ message: "Review created successfully" });
        })
        .catch(err => {
            res.status(500).json({ message: "Failed to create review", error: err });
        });
}

export function hideReview(req, res) {
    if (req.user == null || req.user.role !== "admin") {
        return res.status(403).json({ message: "You are not authorized to hide reviews" });
    }

    const reviewId = req.params.id;

    Review.findByIdAndUpdate(reviewId, { isHidden: true }, { new: true })
        .then(review => {
            if (!review) {
                return res.status(404).json({ message: "Review not found" });
            }
            res.json({ message: "Review hidden successfully" });
        })
        .catch(err => {
            res.status(500).json({ message: "Failed to hide review", error: err });
        });
}

export function unhideReview(req, res) {
    if (req.user == null || req.user.role !== "admin") {
        return res.status(403).json({ message: "You are not authorized to unhide reviews" });
    }

    const reviewId = req.params.id;

    Review.findByIdAndUpdate(reviewId, { isHidden: false }, { new: true })
        .then(review => {
            if (!review) {
                return res.status(404).json({ message: "Review not found" });
            }
            res.json({ message: "Review unhidden successfully" });
        })
        .catch(err => {
            res.status(500).json({ message: "Failed to unhide review", error: err });
        });
}
