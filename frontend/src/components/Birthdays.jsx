import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import Menu from './Menu';
import FriendsSideBar from './FriendsSideBar';
import '../styles/Birthdays.css'; // Ensure you have the styles in this file
import { backendUrl } from '../App';

const Birthdays = () => {
  const [birthdays, setBirthdays] = useState([]);
  const [loading, setLoading] = useState(true); // Add a loading state
  const navigate = useNavigate(); 

  useEffect(() => {
    // Fetch birthdays from the backend
    axios.get(backendUrl + '/api/friends/birthdays', { headers: { 'x-auth-token': localStorage.getItem('token') } })
      .then(response => {
        // Get current date
        const today = new Date();
        const currentYear = today.getFullYear();

        // Create a new date for each birthday using the current year
        const sortedBirthdays = response.data.map(birthday => {
          const dob = new Date(birthday.dob);
          const upcomingBirthday = new Date(currentYear, dob.getMonth(), dob.getDate());
          
          // Adjust for birthdays that have already passed this year
          if (upcomingBirthday < today) {
            upcomingBirthday.setFullYear(currentYear + 1); // Move to next year
          }

          // Calculate current age and the age for the next birthday
          const currentAge = currentYear - dob.getFullYear();
          const nextBirthdayAge = upcomingBirthday.getFullYear() - dob.getFullYear();

          return {
            ...birthday,
            upcomingBirthday,
            currentAge,
            nextBirthdayAge,
          };
        }).sort((a, b) => a.upcomingBirthday - b.upcomingBirthday); // Sort by the upcoming birthday date

        setBirthdays(sortedBirthdays);
        setLoading(false); // Stop loading once birthdays are fetched
      })
      .catch(error => {
        console.error('There was an error fetching the birthdays!', error);
        setLoading(false); // Stop loading even if there's an error
      });
  }, []);

  console.log(birthdays);

  return (
    <>
      <Navbar />
      <Menu />

      <div className="home2">
        <FriendsSideBar />
        <div className="birthday-container">
          <h2 className='birthday-header'>Upcoming Birthdays</h2>
          {loading ? (
            <p>Loading birthdays...</p> // Show loading message while fetching data
          ) : birthdays.length > 0 ? (
            <div className="birthday-list">
              {birthdays.map(birthday => (
                <div key={birthday.username} className="birthday-card">
                  <div className='birth-data'>
                  <img
                    src={`${backendUrl}/${birthday.profilePicture}`}
                    alt={birthday.username}
                    className="birthday-profile-picture"
                  />
                  <div className="birthday-info">
                    <p className='birthday-username'>{birthday.username}</p>
                    <p>{`${new Date(birthday.dob).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`}</p>
                    <p>{`Turning ${birthday.nextBirthdayAge} years old`}</p>
                  </div>
                  </div>
{/* 
                  <button className='birthday-btn' onClick={() => navigate(`/birthday-post/:friendId/:friendUsername`)}>
      Post Birthday Card
    </button> */}

<button 
  className='birthday-btn' 
  onClick={() => navigate(`/birthday-post/${birthday.friendId}/${birthday.username}`)}>
  Post Birthday Card
</button>


                </div>
              ))}
            </div>
          ) : (
            <p>No upcoming birthdays.</p> // Show this when loading is false and birthday list is empty
          )}
        </div>
      </div>
    </>
  );
};

export default Birthdays;
