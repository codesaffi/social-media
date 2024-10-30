import React, { useState } from 'react';
import axios from 'axios'; 
import '../styles/ProfilePost.css';
import "../styles/Profile.css"
import { backendUrl } from '../App';

const ProfilePosts = ({ posts, profile }) => {
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState({});
  const [showCommentForm, setShowCommentForm] = useState({});

  const handleLike = async (postId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(`${backendUrl}/api/posts/like/${postId}`, {}, {
        headers: { 'x-auth-token': token },
      });
    } catch (err) {
      console.error('Error liking post:', err.response ? err.response.data : err.message);
    }
    };

  const handleCommentChange = (e) => {
    setCommentText(e.target.value);
  };

  const handleCommentSubmit = async (postId) => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.post(
        `${backendUrl}/api/posts/comment/${postId}`, 
        { text: commentText }, 
        { headers: { 'x-auth-token': token } }
      );
  
      // Update comments state to include the new comment with username
      setComments(prev => ({
        ...prev,
        [postId]: res.data
      }));
  
      setCommentText(''); // Clear the input field
    } catch (err) {
      console.error('Error commenting on post:', err.response ? err.response.data : err.message);
    }
  };

  const fetchComments = async (postId) => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get(`${backendUrl}/api/posts/comments/${postId}`, {
        headers: { 'x-auth-token': token },
      });
      setComments(prev => ({ ...prev, [postId]: res.data }));
      setShowCommentForm(prev => ({ ...prev, [postId]: true }));
    } catch (err) {
      console.error('Error fetching comments:', err.response ? err.response.data : err.message);
    }
  };

  return (
    <div className="profile-posts">
      {posts.map((post) => (
        <div key={post._id} className="post-container">
          <div className="post-header">
            <img className="post-profile-picture" src={`${backendUrl}/${profile.profilePicture}`} alt="Profile" />
            <span className="post-username">{profile.username}</span>
          </div>
          <img className="post-image" src={`${backendUrl}/${post.image}`} alt="Post" />
          <div className="post-actions">
            <button onClick={() => handleLike(post._id)}>
              Like ({post.likes.length})
            </button>
            <button onClick={() => fetchComments(post._id)}>
              Comment
            </button>
          </div>
          <div className="post-caption">
            <span className="post-username">{profile.username}</span> {post.caption}
          </div>

          {/* Comment section */}
          <div className="comments-section">
            {comments[post._id] && comments[post._id].map((comment, idx) => (
              <div key={idx} className="comment">
                <div className='post--comment'>
                  <span className="comment-username">{comment.user.username}</span> {comment.text}
                </div>
              </div>
            ))}

            {/* Always show comment form */}
            {showCommentForm[post._id] && (
              <div className='write-comment'>
                <input
                  className='post-comment-input' 
                  type="text" 
                  value={commentText} 
                  onChange={handleCommentChange} 
                  placeholder="Write a comment..." 
                />
                <button className='comment-post-btn' onClick={() => handleCommentSubmit(post._id)}>
                  Post
                </button>
              </div>
            )}
          </div>
        </div>
      ))} 

    </div>
  );
};

export default ProfilePosts;
