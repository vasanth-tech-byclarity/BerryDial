const baseUrl = import.meta.env.VITE_APP_BASE_URL_API;

export const apiEndpoints = {
  conversations: `${baseUrl}/conversations`,
  audio: `${baseUrl}/audio`,
  appointment: `${baseUrl}/appointment`,
  twilioInboundCall: `${baseUrl}/twilio/inbound_call`,
};

export const zoomUrl = "https://zoom.us";
export const calendarUrl = "https://calendar.google.com";
export const orthoBerryUrl = "https://www.orthoberry.com/";
