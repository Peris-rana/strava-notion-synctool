import axios from "axios";
import dotenv from "dotenv";
import { DateTime } from "luxon";

dotenv.config();

const notion = axios.create({
  baseURL: "https://api.notion.com/v1/",
  headers: {
    Authorization: `Bearer ${process.env.NOTION_SECRET}`,
    "Notion-Version": "2022-06-28",
    "Content-Type": "application/json",
  },
});

// Function to check if activity already exists in Notion database

const activityExists = async (activityName, activityDate) => {
  const response = await notion.post(
    "/databases/" + process.env.NOTION_DATABASE_ID + "/query",
    {
      filter: {
        and: [
          {
            property: "Name",
            title: {
              equals: activityName,
            },
          },
          {
            property: "Date",
            date: {
              equals: activityDate,
            },
          },
        ],
      },
      sorts: [
        {
          property: "Date",
          direction: "descending",
        },
      ],
    }
  );
  return response.data.results.length > 0;
};

// Function to add activity to notion database

export const addActivityToNotion = async (activity) => {
  const distanceKm = (activity.distance / 1000).toFixed(2);

  const exists = await activityExists(activity.name, activity.start_date);

  if (exists) {
    console.log(`${activity.name} already exists`);
    return null;
  }
  return notion.post("/pages", {
    parent: { database_id: process.env.NOTION_DATABASE_ID },
    properties: {
      Name: {
        title: [{ text: { content: activity.name } }],
      },
      Date: {
        date: { start: activity.start_date },
      },
      // Type: {
      //   select: { name: activity.type },
      // },
      Distance: {
        number: Number(distanceKm),
      },
      Time: {
        number: activity.moving_time,
      },
    },
  });
};
