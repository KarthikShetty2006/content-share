import React, { useState, useRef, useEffect } from 'react';
import './Home.css';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaHeart,
  FaRegBookmark,
  FaRegCommentDots,
  FaHome,
  FaBookmark,
  FaTimes,
} from 'react-icons/fa';

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [likes, setLikes] = useState([]);
  const [saves, setSaves] = useState({});
  const [showSaved, setShowSaved] = useState(false);
  const [savedVideos, setSavedVideos] = useState([]);
  const [comments, setComments] = useState([]); // All comments for selected video
  const [selectedFood, setSelectedFood] = useState(null); // Current food being commented on
  const [newComment, setNewComment] = useState(''); // New comment text

  const Navigate = useNavigate();
  const containerRef = useRef(null);
  const videoRefs = useRef([]);

  // Fetch videos
  useEffect(() => {
    axios
      .get('https://content-share-livid.vercel.app/api/food', { withCredentials: true })
      .then((res) => setVideos(res.data.foodItems))
      .catch((err) => console.log(err));
  }, []);

  // Video autoplay logic
  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (video) {
        if (index === currentVideoIndex) {
          video.currentTime = 0;
          video.play().catch((err) => console.log('Play error:', err));
        } else {
          video.pause();
        }
      }
    });
  }, [currentVideoIndex]);

  // Scroll/swipe handling
  useEffect(() => {
    const container = containerRef.current;
    let touchStartY = 0;
    let localVideoIndex = 0;

    const handleScroll = (e) => {
      e.preventDefault();
      const delta = e.deltaY;
      const videoHeight = container.clientHeight;
      if (Math.abs(delta) < 50) return;
      if (delta > 0 && localVideoIndex < videos.length - 1) localVideoIndex++;
      else if (delta < 0 && localVideoIndex > 0) localVideoIndex--;
      setCurrentVideoIndex(localVideoIndex);
      container.scrollTo({ top: localVideoIndex * videoHeight, behavior: 'smooth' });
    };

    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
    };
    const handleTouchEnd = (e) => {
      const delta = touchStartY - e.changedTouches[0].clientY;
      const videoHeight = container.clientHeight;
      if (Math.abs(delta) < 50) return;
      if (delta > 0 && localVideoIndex < videos.length - 1) localVideoIndex++;
      else if (delta < 0 && localVideoIndex > 0) localVideoIndex--;
      setCurrentVideoIndex(localVideoIndex);
      container.scrollTo({ top: localVideoIndex * videoHeight, behavior: 'smooth' });
    };

    container.addEventListener('wheel', handleScroll, { passive: false });
    container.addEventListener('touchstart', handleTouchStart);
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('wheel', handleScroll);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [videos.length]);

  // Like toggle
  const toggleLike = async (item) => {
    try {
      const res = await axios.post(
        'https://content-share-livid.vercel.app/api/food/like',
        { foodId: item._id },
        { withCredentials: true }
      );
      const isLiked = res.data.like;
      setVideos((prev) =>
        prev.map((v) =>
          v._id === item._id
            ? { ...v, likeCount: isLiked ? v.likeCount + 1 : v.likeCount - 1 }
            : v
        )
      );
    } catch (err) {
      console.error('Error liking:', err);
    }
  };

  // Save toggle
  const toggleSave = async (item) => {
    try {
      const res = await axios.post(
        'https://content-share-livid.vercel.app/api/food/save',
        { foodId: item._id },
        { withCredentials: true }
      );
      const isSaved = res.data.save;
      setVideos((prev) =>
        prev.map((v) =>
          v._id === item._id
            ? { ...v, saveCount: isSaved ? v.saveCount + 1 : v.saveCount - 1 }
            : v
        )
      );
    } catch (err) {
      console.error('Error saving:', err);
    }
  };

  // Fetch comments for a food
  const openComments = async (food) => {
    try {
      console.log('Fetching comments for food infrontend:', food._id);
      const res = await axios.get(`https://content-share-livid.vercel.app/api/food/comments/${food._id}`, {
        withCredentials: true,
      });
      setComments(res.data.comments || []);
      setSelectedFood(food);
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
  };

  // Post new comment
  const submitComment = async () => {
    if (!newComment.trim()) return;
    try {
      const res = await axios.post(
        `https://content-share-livid.vercel.app/api/food/comment`,
        { foodId: selectedFood._id, commentText: newComment },
        { withCredentials: true }
      );
      // Push the returned comment object
      setComments((prev) => [...prev, res.data.comment]);
      setNewComment('');
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  // Close comment modal
  const closeComments = () => {
    setSelectedFood(null);
    setComments([]);
    setNewComment('');
  };

  return (
    <div className="app-background">
      <div className="phone-frame">
        {!showSaved ? (
          <div className="video-feed-container" ref={containerRef}>
            {videos.map((item, index) => (
              <div key={item._id} className="video-container">
                <video
                  ref={(el) => (videoRefs.current[index] = el)}
                  className="video-player"
                  src={item.video}
                  loop
                  muted
                  playsInline
                  preload="metadata"
                />
                <div className="video-overlay">
                  <p className="video-description">{item.description}</p>
                  <Link to={`/food-partner/${item.foodPartner}`} className="visit-store-btn">
                    Visit store
                  </Link>
                </div>

                <div className="video-actions">
                  <div className="action-btn" onClick={() => toggleLike(item)}>
                    <FaHeart className={`icon ${likes[item._id] ? 'liked' : ''}`} />
                    <span>Likes: {item.likeCount ?? item.likes ?? 0}</span>
                  </div>

                  <div className="action-btn" onClick={() => toggleSave(item)}>
                    <FaRegBookmark className={`icon ${saves[item._id] ? 'saved' : ''}`} />
                    <span>Save: {item.saveCount ?? item.saves ?? 0}</span>
                  </div>

                  <div className="action-btn" onClick={() => openComments(item)}>
                    <FaRegCommentDots className="icon" />
                    <span>Comments</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="saved-container">
            {savedVideos.map((item) => (
              <div key={item._id} className="saved-item">
                <video src={item.food.video} className="saved-video" muted loop autoPlay />
              </div>
            ))}
          </div>
        )}

        {/* Comment Modal */}
        {selectedFood && (
          <div className="comment-modal">
            <div className="comment-box">
              <div className="comment-header">
                <h3>Comments</h3>
                <FaTimes onClick={closeComments} className="close-btn" />
              </div>
              <div className="comment-list">
                {comments.length > 0 ? (
                  comments.map((c, i) => (
                    <p key={i}>
                      <strong>{c.user?.fullName || 'you '}:</strong> {c.comment}
                    </p>
                  ))
                ) : (
                  <p>No comments yet</p>
                )}
              </div>
              <div className="comment-input">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <button onClick={submitComment}>Post</button>
              </div>
            </div>
          </div>
        )}

        <div className="bottom-nav">
          <div
            className={`nav-icon ${!showSaved ? 'active' : ''}`}
            onClick={() => setShowSaved(false)}
          >
            <FaHome />
            <span>Home</span>
          </div>

          <div
            className={`nav-icon ${showSaved ? 'active' : ''}`}
            onClick={() => Navigate('/saved')}
          >
            <FaBookmark />
            <span>Saved</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
