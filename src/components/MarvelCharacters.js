// Import necessary dependencies from React, React Native, and other libraries
import React, { useEffect, useState } from "react";
import { useTheme } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MapView, { Marker, Polyline, Callout } from "react-native-maps";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  Easing,
  Layout,
  FadeOutDown,
  FadeInUp,
  RotateInDownLeft,
  LightSpeedInRight,
  BounceIn,
} from "react-native-reanimated";
import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  FlatList,
  Pressable,
  Modal,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";

// Define the default export function 'MarvelCharacters' that receives props
export default function MarvelCharacters(props) {
  // Use the 'useTheme' hook from react-native-paper to get the theme object
  const theme = useTheme();
  // Use the 'useNavigation' hook from react-navigation to get the navigation object
  const navigation = useNavigation();

  // Define state variables for 'outerkeys' and 'modalVisible' using the useState hook
  const [outerkeys, setOuterKeys] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  // Define an asynchronous function 'storeData' to save data to AsyncStorage
  const storeData = async (value) => {
    try {
      // Convert the value to a string
      const stringValue = value.toString();
      // Store the value in AsyncStorage using the value as both the key and the data
      await AsyncStorage.setItem(stringValue, stringValue);
      // Log the stored value to the console
      console.log(stringValue);
      // Add the value to the 'outerkeys' state
      setOuterKeys((prevKeys) => [...prevKeys, value]);
    } catch (e) {
      // Handle any errors that occur during saving
      // (e.g., logging the error or displaying an error message)
    }
  };

  // Define an asynchronous function 'removeValue' to remove data from AsyncStorage
  removeValue = async (value) => {
    try {
      const stringValue = value.toString();
      // Remove the value from AsyncStorage using the value as the key
      await AsyncStorage.removeItem(stringValue);
      // Log the deleted value to the console
      console.log("deleted:", value);
      // Update the 'outerkeys' state by filtering out the removed value
      setOuterKeys((prevKeys) => prevKeys.filter((key) => key !== value));
    } catch (e) {
      // Handle any errors that occur during removal
      // (e.g., logging the error or displaying an error message)
    }

    console.log("Done.");
  };

  // Define an asynchronous function 'clearAll' to clear all data from AsyncStorage
  clearAll = async () => {
    try {
      // Clear all data from AsyncStorage
      await AsyncStorage.clear();
    } catch (e) {
      // Handle any errors that occur during clearing
      // (e.g., logging the error or displaying an error message)
    }
    console.log("Done.");
  };

  // Define an asynchronous function 'getAllKeys' to retrieve all keys from AsyncStorage
  getAllKeys = async () => {
    try {
      // Retrieve all keys from AsyncStorage
      const keys = await AsyncStorage.getAllKeys();
      // Convert the keys to numbers
      const data = keys.map(Number);
      // Set the 'outerkeys' state with the retrieved keys
      setOuterKeys(data);
    } catch (e) {
      // Handle any errors that occur during key retrieval
      // (e.g., logging the error or displaying an error message)
    }
  };

  // Call the 'getAllKeys' function when the component mounts using the useEffect hook
  useEffect(() => {
    getAllKeys();
  }, []);
  return (
    <Animated.View
      style={styles.container}
      // layout={Layout.duration(200).delay(200)}
      entering={BounceIn}
      // exiting={FadeOutDown}
    >
      <SafeAreaView style={styles.safe}>
        <FlatList
          data={props.characters}
          keyExtractor={({ id }) => id}
          renderItem={({ item, index }) => (
            <View style={styles.characterContainer}>
              <Text style={[styles.name, { color: theme.colors.text }]}>
                Name: {item.name}
              </Text>
              {outerkeys.includes(item.id) ? (
                <Ionicons
                  name="star"
                  size={30}
                  color="#FFD700"
                  style={styles.starIcon}
                />
              ) : (
                ""
              )}
              {outerkeys.includes(item.id) ? (
                <Pressable
                  style={[styles.favoriteButton, styles.removeFavoriteButton]}
                  onPress={() => {
                    removeValue(item.id);
                  }}
                >
                  <Text style={styles.favoriteButtonText}>Remove favorite</Text>
                </Pressable>
              ) : (
                <Pressable
                  style={[styles.favoriteButton, styles.addFavoriteButton]}
                  onPress={() => {
                    storeData(item.id);
                  }}
                >
                  <Text style={styles.favoriteButtonText}>Add favorite</Text>
                </Pressable>
              )}

              <Pressable
                style={styles.detailButton}
                onPress={() => {
                  console.log("Click");
                  navigation.navigate("Detail", {
                    id: item.id,
                  });
                }}
              >
                <Text
                  style={[
                    styles.detailButtonText,
                    { color: theme.colors.text },
                  ]}
                >
                  Go to detail page
                  <Ionicons
                    name="information-circle"
                    size={20}
                    color="#870000"
                  />
                </Text>
              </Pressable>
              <Pressable
                style={styles.mapButton}
                onPress={() => {
                  console.log("Click");
                  navigation.navigate("Map", {
                    id: item.id,
                  });
                }}
              >
                <Text
                  style={[styles.mapButtonText, { color: theme.colors.text }]}
                >
                  Go to location
                  <Ionicons name="navigate" size={20} color="#002d5c" />
                </Text>
              </Pressable>
              <Image
                style={styles.image}
                source={{
                  uri: item.url,
                }}
              />
              {index < props.characters.length - 1 && (
                <View style={styles.separator} />
              )}
            </View>
          )}
        />
      </SafeAreaView>
    </Animated.View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safe: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  characterContainer: {
    marginBottom: 20,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  favoriteButton: {
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    width: 160,
  },
  starIcon: {
    marginRight: 5,
  },
  modalHeadBrand: {
    textAlign: "center",
    fontSize: 24,
  },
  modelHeadView: {
    flexDirection: "row",
    alignItems: "center",
  },
  mapView: {
    width: "100%",
    height: 180,
  },
  addFavoriteButton: {
    borderColor: "#002d5c",
    backgroundColor: "#002d5c",
  },
  removeFavoriteButton: {
    borderColor: "#870000",
    backgroundColor: "#870000",
  },
  favoriteButtonText: {
    color: "#fff",
    marginLeft: 5,
    fontSize: 14,
  },
  detailButton: {
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#870000",
  },
  mapContainer: {
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "lightgrey",
    backgroundColor: "lightgrey",
    width: "70%",
    height: 280,
    overflow: "hidden",
    alignSelf: "center",
  },
  detailButtonText: {
    color: "#870000",
    marginLeft: 5,
    fontSize: 14,
  },
  mapButton: {
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#002d5c",
  },
  mapButtonText: {
    color: "#002d5c",
    marginLeft: 5,
    fontSize: 14,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  separator: {
    height: 1,
    backgroundColor: "gray",
    marginVertical: 10,
  },
});
