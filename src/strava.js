import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

// Function to get Strava Access Token
export const getStravaAccessToken = async () => {
  try {
    const response = await axios.post(
      "https://www.strava.com/api/v3/oauth/token",
      {
        client_id: process.env.STRAVA_CLIENT_ID,
        client_secret: process.env.STRAVA_CLIENT_SECRET,
        refresh_token: process.env.STRAVA_REFRESH_TOKEN,
        grant_type: "refresh_token",
      }
    );
    return response.data.access_token;
  } catch (error) {
    console.log(error);
    return null;
  }
};


// Function to get Strava Activities
export const getStravaActivities = async (access_token, perPage = 20) => {
  try {
    const response = await axios.get(
      `https://www.strava.com/api/v3/athlete/activities?per_page=${perPage}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.log(error);
  }
};
