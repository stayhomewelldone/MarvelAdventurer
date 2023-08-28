// Importing React module from "react".
import React from "react";

// Creating a PreferencesContext using React.createContext, with initial values for toggleTheme and isThemeDark.
export const PreferencesContext = React.createContext({
  toggleTheme: () => {}, // A function to toggle the theme, initially empty implementation.
  isThemeDark: false, // A boolean indicating whether the theme is dark, initially set to false.
});
