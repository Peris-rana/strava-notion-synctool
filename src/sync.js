import { getStravaAccessToken, getStravaActivities } from "./strava.js";
import { addActivityToNotion } from "./notion.js";

export const syncStravaToNotion = async () => {
  console.log("Starting synchronization from Strava to Notion...");

  const accessToken = await getStravaAccessToken();
  const activities = await getStravaActivities(accessToken, 10);

  if (!Array.isArray(activities)) {
    console.log("not an array");
  }

  for (const activity of activities) {
    console.log(activity.name);

    try {
      await addActivityToNotion(activity);
    } catch (error) {
      console.log("Failed to add activity to notion", activity.name);
      console.log(error)
    }
  }
};
