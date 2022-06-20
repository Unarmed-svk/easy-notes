import cookie from "react-cookies";

export const getTokenCookie = () => cookie.load("x-access-token");
export const removeTokenCookie = () => cookie.remove("x-access-token", { path: "/" });
export const getAuthHeader = () => {
  return { headers: { Authorization: `Bearer ${getTokenCookie()}` } };
};
export const getAuth = () => {
  return { Authorization: `Bearer ${getTokenCookie()}` };
};

export const getPreferences = (userID) => {
  const value = localStorage.getItem(`pref${userID.slice(-6)}`);
  if (!value) return {};
  return JSON.parse(value);
};

export const savePreferences = (userID, preferences) => {
  const value = JSON.stringify(preferences);
  localStorage.setItem(`pref${userID.slice(-6)}`, value);
};
