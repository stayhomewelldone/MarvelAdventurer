import {
  NavigationContainer,
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from "@react-navigation/native";
import {
  MD3DarkTheme,
  MD3LightTheme,
  adaptNavigationTheme,
  PaperProvider,
} from "react-native-paper";
import merge from "deepmerge";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import { PreferencesContext } from "../utils/PreferencesContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import md5 from "md5";
import MarvelCharacters from "../components/MarvelCharacters";
import MarvelMaps from "../components/MarvelMaps";
import Settings from "../components/Settings";
import Detail from "../components/Detail";

const locations = {
  snackbars: [
    {
      name: "Snackbar 1",
      latitude: 51.917744,
      longitude: 4.478421,
    },
    {
      name: "Snackbar 2",
      latitude: 51.919583,
      longitude: 4.485384,
    },
    {
      name: "Snackbar 3",
      latitude: 51.918002,
      longitude: 4.472671,
    },
    {
      name: "Snackbar 4",
      latitude: 51.91589,
      longitude: 4.478973,
    },
    {
      name: "Snackbar 5",
      latitude: 51.912345,
      longitude: 4.471261,
    },
    {
      name: "Snackbar 6",
      latitude: 51.913729,
      longitude: 4.480952,
    },
    {
      name: "Snackbar 7",
      latitude: 51.915466,
      longitude: 4.490148,
    },
    {
      name: "Snackbar 8",
      latitude: 51.92063,
      longitude: 4.488042,
    },
    {
      name: "Snackbar 9",
      latitude: 51.922109,
      longitude: 4.477282,
    },
    {
      name: "Snackbar 10",
      latitude: 51.916831,
      longitude: 4.472158,
    },
  ],
};
export default function NavigationComponent() {
  // Adapt the navigation theme based on the provided light and dark themes
  const { LightTheme, DarkTheme } = adaptNavigationTheme({
    reactNavigationLight: NavigationDefaultTheme,
    reactNavigationDark: NavigationDarkTheme,
  });

  // Merge the MD3LightTheme with the LightTheme
  const CombinedDefaultTheme = merge(MD3LightTheme, LightTheme);

  // Merge the MD3DarkTheme with the DarkTheme
  const CombinedDarkTheme = merge(MD3DarkTheme, DarkTheme);

  // Define a state variable 'isThemeDark' with an initial value of 'false'
  const [isThemeDark, setIsThemeDark] = React.useState(false);

  // Define a callback function 'toggleTheme' that toggles the theme and updates the 'isThemeDark' state
  const toggleTheme = React.useCallback(() => {
    // Store the inverted value of 'isThemeDark' using the 'storeData' function
    storeData(!isThemeDark);
    // Update the 'isThemeDark' state to its inverted value
    return setIsThemeDark(!isThemeDark);
  }, [isThemeDark]);

  // Define an asynchronous function 'storeData' that stores the theme value in AsyncStorage
  const storeData = async (value) => {
    try {
      // Convert the value to a string
      const stringValue = value.toString();
      // Store the string value in AsyncStorage with the key "isThemeDark"
      await AsyncStorage.setItem("isThemeDark", stringValue);
    } catch (e) {
      // Handle any errors that occur during saving
    }
  };

  // Create a preferences object using React.useMemo, which memoizes the object so it doesn't change unnecessarily
  const preferences = React.useMemo(
    () => ({
      toggleTheme,
      isThemeDark,
    }),
    [toggleTheme, isThemeDark]
  );

  // Determine the theme based on the value of 'isThemeDark'
  // If 'isThemeDark' is true, use CombinedDarkTheme, otherwise use CombinedDefaultTheme
  let theme = isThemeDark ? CombinedDarkTheme : CombinedDefaultTheme;

  // Create a Tab navigator using the createMaterialBottomTabNavigator function
  const Tab = createMaterialBottomTabNavigator();

  // Define state variables for isLoading and characters using the useState hook
  const [isLoading, setLoading] = useState(true);
  const [characters, setCharacter] = useState([]);

  // Set the values for publicKey, timestamp, privateKey, limit, and hash
  const publicKey = "78557a90ec01081caf66e5e5a2825fdd";
  const timestamp = new Date().getTime();
  const privateKey = "70135b0de130582a422bff0d1850aae322225ebd";
  const limit = 10;
  const hash = md5(timestamp + privateKey + publicKey);

  // Define an asynchronous function 'getCharacters' to fetch character data from an API
  const getCharacters = async () => {
    try {
      // Make a fetch request to the Marvel API to retrieve character data
      const response = await fetch(
        `https://gateway.marvel.com/v1/public/characters?limit=${limit}&ts=${timestamp}&apikey=${publicKey}&hash=${hash}`
      );
      // Parse the response data as JSON
      const data = await response.json();
      // Extract the character data from the response
      const characterData = data.data.results;
      // Modify the character data by mapping it to a new format
      const modifiedData = characterData.map((value, index) => ({
        id: index,
        name: value.name,
        description:
          value.description == ""
            ? "Marvel characters are a diverse group of superheroes and villains with extraordinary powers. From Iron Man to Spider-Man, they captivate audiences through comics, movies, and shows. These iconic characters bring unique stories, struggles, and motivations, inspiring fans worldwide."
            : value.description,
        url: value.thumbnail.path + "." + value.thumbnail.extension,
        latitude: locations.snackbars[index].latitude,
        longitude: locations.snackbars[index].longitude,
        comics: value.comics.available,
        series: value.series.available,
        events: value.events.available,
      }));
      // Set the 'characters' state with the modified character data
      setCharacter(modifiedData);
    } catch (error) {
      // Handle any errors that occur during the fetch request
      console.error(error);
    } finally {
      // Set the 'isLoading' state to false after the fetch request is completed
      setLoading(false);
    }
  };

  // Define an asynchronous function 'getMyObject' to retrieve data from AsyncStorage
  getMyObject = async () => {
    try {
      // Retrieve the value associated with the key "isThemeDark" from AsyncStorage
      const jsonValue = await AsyncStorage.getItem("isThemeDark");
      // Convert the retrieved value to a boolean
      let boolValue = jsonValue === "true";
      // Update the 'isThemeDark' state with the retrieved value
      setIsThemeDark(boolValue);
      // Return the parsed JSON value if it's not null
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      // Handle any errors that occur during reading
    }
  };

  // Run the 'getCharacters' and 'getMyObject' functions when the component mounts
  useEffect(() => {
    getCharacters();
    getMyObject();
  }, []);

  // Create a native stack navigator using the createNativeStackNavigator function
  const HomeStack = createNativeStackNavigator();

  // Define a function component 'HomeStackScreen' that renders the home screen and detail screen
  function HomeStackScreen() {
    return (
      <HomeStack.Navigator>
        <HomeStack.Screen name="Home">
          {(props) => <MarvelCharacters {...props} characters={characters} />}
        </HomeStack.Screen>
        <HomeStack.Screen name="Detail">
          {(props) => <Detail {...props} characters={characters} />}
        </HomeStack.Screen>
      </HomeStack.Navigator>
    );
  }

  return (
    // Context is wired into the local state of our main component, so that its values could be propagated throughout the entire application
    <PreferencesContext.Provider value={preferences}>
      <PaperProvider theme={theme}>
        <NavigationContainer theme={theme}>
          <Tab.Navigator
            initialRouteName="HomeMarvel"
            shifting={true}
            barStyle={{ backgroundColor: "#000042" }}
            activeColor="#aa1428"
            inactiveColor="#aa1428"
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;

                if (route.name === "HomeMarvel") {
                  iconName = "man";
                } else if (route.name === "Settings") {
                  iconName = "cog-sharp";
                } else if (route.name === "Map") {
                  iconName = "planet";
                } else if (route.name === "Camera") {
                  iconName = "camera-sharp";
                }

                // You can return any component that you like here!
                return <Ionicons name={iconName} size={20} color={color} />;
              },
              tabBarActiveTintColor: "tomato",
              tabBarInactiveTintColor: "gray",
            })}
          >
            <Tab.Screen
              name="HomeMarvel"
              options={{ tabBarBadge: characters.length }}
              component={HomeStackScreen}
            ></Tab.Screen>

            <Tab.Screen name="Map" options={{ tabBarBadge: characters.length }}>
              {(props) => <MarvelMaps {...props} characters={characters} />}
            </Tab.Screen>
            <Tab.Screen name="Settings" component={Settings} />
          </Tab.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </PreferencesContext.Provider>
  );
}
