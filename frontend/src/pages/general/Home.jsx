import React, { useState, useRef, useEffect } from "react";
import "./Home.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

import {
  FaHeart,
  FaRegBookmark,
  FaRegCommentDots,
  FaHome,
  FaBookmark,
  FaTimes,
  FaPlus,
  FaUser,
} from "react-icons/fa";

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  const [likes, setLikes] = useState([]);
  const [saves, setSaves] = useState({});

  const [comments, setComments] = useState([]);
  const [selectedFood, setSelectedFood] = useState(null);
  const [newComment, setNewComment] = useState("");

  const navigate = useNavigate();

  const containerRef = useRef(null);
  const videoRefs = useRef([]);

  // ======================================================
  // FETCH VIDEOS
  // ======================================================

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/food", {
        withCredentials: true,
      })
      .then((res) => {
        setVideos(res.data.foodItems || []);
      })
      .catch((err) => {
        console.error("Error fetching videos:", err);
      });
  }, []);

  // ======================================================
  // VIDEO AUTOPLAY
  // ======================================================

  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (video) {
        if (index === currentVideoIndex) {
          video.currentTime = 0;

          video
            .play()
            .catch((err) => console.log("Play error:", err));
        } else {
          video.pause();
        }
      }
    });
  }, [currentVideoIndex]);

  // ======================================================
  // SCROLL / SWIPE
  // ======================================================

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    let touchStartY = 0;
    let localVideoIndex = currentVideoIndex;

    const handleScroll = (e) => {
      e.preventDefault();

      const delta = e.deltaY;
      const videoHeight = container.clientHeight;

      if (Math.abs(delta) < 50) return;

      if (
        delta > 0 &&
        localVideoIndex < videos.length - 1
      ) {
        localVideoIndex++;
      } else if (
        delta < 0 &&
        localVideoIndex > 0
      ) {
        localVideoIndex--;
      }

      setCurrentVideoIndex(localVideoIndex);

      container.scrollTo({
        top: localVideoIndex * videoHeight,
        behavior: "smooth",
      });
    };

    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e) => {
      const delta =
        touchStartY - e.changedTouches[0].clientY;

      const videoHeight = container.clientHeight;

      if (Math.abs(delta) < 50) return;

      if (
        delta > 0 &&
        localVideoIndex < videos.length - 1
      ) {
        localVideoIndex++;
      } else if (
        delta < 0 &&
        localVideoIndex > 0
      ) {
        localVideoIndex--;
      }

      setCurrentVideoIndex(localVideoIndex);

      container.scrollTo({
        top: localVideoIndex * videoHeight,
        behavior: "smooth",
      });
    };

    container.addEventListener(
      "wheel",
      handleScroll,
      { passive: false }
    );

    container.addEventListener(
      "touchstart",
      handleTouchStart
    );

    container.addEventListener(
      "touchend",
      handleTouchEnd
    );

    return () => {
      container.removeEventListener(
        "wheel",
        handleScroll
      );

      container.removeEventListener(
        "touchstart",
        handleTouchStart
      );

      container.removeEventListener(
        "touchend",
        handleTouchEnd
      );
    };
  }, [videos.length]);

  // ======================================================
  // LIKE
  // ======================================================

  const toggleLike = async (item) => {
    try {
      const res = await axios.post(
        "http://localhost:3000/api/food/like",
        {
          foodId: item._id,
        },
        {
          withCredentials: true,
        }
      );

      const isLiked = res.data.like;

      setLikes((prev) => ({
        ...prev,
        [item._id]: isLiked,
      }));

      setVideos((prev) =>
        prev.map((v) =>
          v._id === item._id
            ? {
                ...v,
                likeCount: isLiked
                  ? v.likeCount + 1
                  : Math.max(0, v.likeCount - 1),
              }
            : v
        )
      );
    } catch (err) {
      console.error("Error liking:", err);
    }
  };

  // ======================================================
  // SAVE
  // ======================================================

  const toggleSave = async (item) => {
    try {
      const res = await axios.post(
        "http://localhost:3000/api/food/save",
        {
          foodId: item._id,
        },
        {
          withCredentials: true,
        }
      );

      const isSaved = res.data.save;

      setSaves((prev) => ({
        ...prev,
        [item._id]: isSaved,
      }));

      setVideos((prev) =>
        prev.map((v) =>
          v._id === item._id
            ? {
                ...v,
                saveCount: isSaved
                  ? v.saveCount + 1
                  : Math.max(0, v.saveCount - 1),
              }
            : v
        )
      );
    } catch (err) {
      console.error("Error saving:", err);
    }
  };

  // ======================================================
  // OPEN COMMENTS
  // ======================================================

  const openComments = async (food) => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/food/comments/${food._id}`,
        {
          withCredentials: true,
        }
      );

      setComments(res.data.comments || []);
      setSelectedFood(food);
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  // ======================================================
  // ADD COMMENT
  // ======================================================

  const submitComment = async () => {
    if (!newComment.trim() || !selectedFood) {
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:3000/api/food/comment",
        {
          foodId: selectedFood._id,
          commentText: newComment,
        },
        {
          withCredentials: true,
        }
      );

      setComments((prev) => [
        ...prev,
        res.data.comment,
      ]);

      setNewComment("");
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  // ======================================================
  // CLOSE COMMENTS
  // ======================================================

  const closeComments = () => {
    setSelectedFood(null);
    setComments([]);
    setNewComment("");
  };

  // ======================================================
  // RENDER
  // ======================================================

  return (
    <div className="app-background">
      <div className="phone-frame">

        {/* ================= VIDEO FEED ================= */}

        <div
          className="video-feed-container"
          ref={containerRef}
        >
          {videos.map((item, index) => (
            <div
              key={item._id}
              className="video-container"
            >
              <video
                ref={(el) =>
                  (videoRefs.current[index] = el)
                }
                className="video-player"
                src={item.video}
                loop
                muted
                playsInline
                preload="metadata"
              />

              {/* VIDEO INFORMATION */}

              <div className="video-overlay">
                <p className="video-description">
                  {item.description}
                </p>

                <Link
                  to={`/food-partner/${item.foodPartner?._id || item.foodPartner}`}
                  className="visit-store-btn"
                >
                  Visit Profile
                </Link>
              </div>

              {/* ACTIONS */}

              <div className="video-actions">

                {/* LIKE */}

                <div
                  className="action-btn"
                  onClick={() =>
                    toggleLike(item)
                  }
                >
                  <FaHeart
                    className={`icon ${
                      likes[item._id]
                        ? "liked"
                        : ""
                    }`}
                  />

                  <span>
                    Likes:{" "}
                    {item.likeCount ??
                      item.likes ??
                      0}
                  </span>
                </div>

                {/* SAVE */}

                <div
                  className="action-btn"
                  onClick={() =>
                    toggleSave(item)
                  }
                >
                  <FaRegBookmark
                    className={`icon ${
                      saves[item._id]
                        ? "saved"
                        : ""
                    }`}
                  />

                  <span>
                    Save:{" "}
                    {item.saveCount ??
                      item.saves ??
                      0}
                  </span>
                </div>

                {/* COMMENTS */}

                <div
                  className="action-btn"
                  onClick={() =>
                    openComments(item)
                  }
                >
                  <FaRegCommentDots className="icon" />

                  <span>
                    Comments
                  </span>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* ================= COMMENT MODAL ================= */}

        {selectedFood && (
          <div className="comment-modal">
            <div className="comment-box">

              <div className="comment-header">
                <h3>Comments</h3>

                <FaTimes
                  onClick={closeComments}
                  className="close-btn"
                />
              </div>

              <div className="comment-list">

                {comments.length > 0 ? (
                  comments.map((c, i) => (
                    <p key={i}>
                      <strong>
                        {c.foodPartner?.name ||
                          "Creator"}
                        :
                      </strong>{" "}
                      {c.comment}
                    </p>
                  ))
                ) : (
                  <p>
                    No comments yet
                  </p>
                )}

              </div>

              <div className="comment-input">

                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) =>
                    setNewComment(
                      e.target.value
                    )
                  }
                />

                <button
                  onClick={submitComment}
                >
                  Post
                </button>

              </div>
            </div>
          </div>
        )}

        {/* ================= BOTTOM NAVIGATION ================= */}

        <div className="bottom-nav">

          {/* HOME */}

          <div
            className="nav-icon active"
            onClick={() =>
              navigate("/home")
            }
          >
            <FaHome />
            <span>Home</span>
          </div>


          {/* UPLOAD */}

          <div
            className="nav-icon"
            onClick={() =>
              navigate("/create-food")
            }
          >
            <FaPlus />
            <span>Upload</span>
          </div>


          {/* SAVED */}

          <div
            className="nav-icon"
            onClick={() =>
              navigate("/saved")
            }
          >
            <FaBookmark />
            <span>Saved</span>
          </div>


          {/* PROFILE */}

          <div
            className="nav-icon"
            onClick={() =>
              navigate("/profile")
            }
          >
            <FaUser />
            <span>Profile</span>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Home;