import styled from "styled-components";

export const colors = ['#FFD700', '#C0C0C0', '#cd7f32'];

export const LeaderboardContainer = styled.div`
  width: calc(100vw - 50px);
  height: calc(100vh - 50px);
  padding: 25px;
  background-color: #1a1a1a;
  border-radius: 15px;
  color: black; /* Change text color to black */
`;

export const PodiumContainer = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: row;
  margin-right: 30px; /* Spacing between podium and leaderboard */
  align-items: center;
  justify-content: center;
  background-color: #2a2a2a; /* Darker background color for podium */
  border-radius: 10px; /* Rounded corners for podium container */
  padding: 20px; /* Add padding */
  color: black; /* Change text color to black */
`;

export const PodiumPlace = styled.div<{ place: number }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 15px;
  position: relative; /* Added to allow placing the rectangle behind */

  transition: transform 0.3s; /* Animation effect for podium */

  &:hover {
    transform: scale(1.1); /* Scale up on hover */
  }

  .place {
    font-size: 2.5rem; /* Increase font size */
    font-weight: bold;
    color: black; /* Change text color to black */
    margin-top: 10px;
  }

  .podium {
    width: ${props => (props.place === 1 ? '150px' : props.place === 2 ? '130px' : '110px')}; 
    height: ${props => (props.place === 1 ? '150px' : props.place === 2 ? '130px' : '110px')};
    background-color: ${props =>
      props.place === 1 ? '#FFD700' :
      props.place === 2 ? '#C0C0C0' :
      '#CD7F32'};
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    
    img {
      width: 90%;
      height: 90%;
      border-radius: 50%;
      object-fit: cover;
    }
  }

  /* Added rectangle behind as background */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #bce3db; /* Green color for the rectangle */
    z-index: -1; /* Ensure rectangle is behind */
    transform: scale(1.1); /* Scale up the rectangle */
    border-radius: 20px; /* Rounded corners for the rectangle */
    opacity: 0.6; /* Opacity for the rectangle */
  }
`;

export const LeaderboardScrollContainer = styled.div`
  flex-grow: 1;
  max-height: calc(100vh - 200px);
  overflow-y: scroll; /* Allow vertical scrolling */
  overflow-x: hidden; /* Hide horizontal scrolling */
  height: 100vh; /* Set height to 100% of screen height */
  width: calc(80vw - 100px); /* Set width */
`;

export const LeaderboardItem = styled.li<{ rank: number }>`
  display: flex;
  align-items: center;
  background-color: white; /* Set background color to white */
  border: 1px solid black; /* Set border color to black */
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 10px;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateX(5px);
    box-shadow: 0 0 20px black; /* Change box shadow on hover */
  }
`;

export const Title = styled.h1`
  color: black; /* Change text color to black */
  text-align: center;
  font-size: 2.5rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  margin-bottom: 20px; /* Add bottom spacing */
`;

export const PlayerInfo = styled.div`
  flex-grow: 1;
`;

export const PlayerName = styled.span`
  color: black; /* Change text color to black */
  font-size: 1.1rem;
  font-weight: bold;
`;

export const PlayerPoints = styled.span`
  color: black;
  font-weight: bold;
  margin-right: 15px;
`;

export const PlayerTime = styled.span`
  color: #A0A0A0;
`;

export const Rank = styled.span`
  font-size: 1.2rem;
  font-weight: bold;
  color: black; /* Change text color to black */
  margin-right: 15px;
  text-align: center;
  align-self: center;
`;

export const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 15px;
`;

export const LeaderboardList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

export const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100vh; /* Set fixed height */
  overflow: hidden; /* Prevent scrolling */
  position: relative;
  z-index: 1;
  background-color: black;
  width: 100vw;
  padding: 20px; /* Add padding */
`;

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-top: 10vh; /* Set top margin to 10% of screen height */
  padding: 0 20px; /* Add horizontal padding */
`;
