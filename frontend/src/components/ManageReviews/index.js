import React, { useState } from "react";
import "./ManageReviews.css";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { Redirect } from "react-router-dom";
import { thunkGetUserReviews, clearReviews } from "../../store/reviews";
import ReviewsTile from "../ReviewsTile";

const ManageReviews = () => {
  const session = useSelector((state) => state.session.user);
  const reviews = useSelector((state) => Object.values(state.reviews));
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(thunkGetUserReviews())
      .then(() => setLoading(false))
      .catch((err) => {
        setLoading(false);
      });

    return () => dispatch(clearReviews());
  }, [dispatch]);

  // TODO: better handle error pages and errros

  if (!session) return <Redirect to="/" />;

  if (loading) return <h1>Loading...</h1>;

  return (
    <div className="manage-reviews-container">
      <h1>Manage Reviews</h1>

      <div className="manage-reviews">
        {reviews.map((review) => (
          <ReviewsTile
            review={review}
            key={review.id}
            sessionId={session.id}
            isManage={true}
          />
        ))}
      </div>
    </div>
  );
};

export default ManageReviews;
