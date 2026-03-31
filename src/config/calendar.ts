import ApiCalendar from "react-google-calendar-api";

const config = {
    clientId: import.meta.env.VITE_CALENDAR_ID_CLIENT,
    apiKey: import.meta.env.VITE_CALENDAR_API_BROWSER,
    scope: "https://www.googleapis.com/auth/calendar",
    discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"]
}

const apiCalendar = new ApiCalendar(config);