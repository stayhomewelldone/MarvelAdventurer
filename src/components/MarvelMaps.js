// Importing necessary modules and components from various libraries.
import MapView, { Marker, Polyline, Callout } from "react-native-maps";
import { useTheme } from "react-native-paper";
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
  RollOutLeft,
  RollInLeft,
} from "react-native-reanimated";
import { Image } from "expo-image";
import * as Location from "expo-location";
import { StyleSheet, View, Text, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import MapViewDirections from "react-native-maps-directions";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import Ionicons from "react-native-vector-icons/Ionicons";

// MarvelMaps component that renders the map view with markers and directions for Marvel characters.
export default function MarvelMaps(props, { route, navigation }) {
  const [image, setImage] = useState(null);

  // Request necessary permissions on component mount.
  useEffect(() => {
    (async () => {
      const cameraPermission =
        await ImagePicker.requestCameraPermissionsAsync();
      const mediaPermission = await MediaLibrary.requestPermissionsAsync();
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
      if (mediaPermission.status !== "granted") {
        alert("Permission for media access needed");
      }
      if (cameraPermission.status !== "granted") {
        alert("Permission for camera access needed.");
      }
    })();
  }, []);

  // Function to pick an image from the camera and save it to the library.
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result.assets);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      await MediaLibrary.saveToLibraryAsync(result.assets[0].uri);
    }
  };
  // Extracting character ID from route params.
  const { id } = props.route.params ? props.route.params : "";

  // State to store the user's location.
  const [userLocation, setUserLocation] = useState({
    latitude: 51.919583,
    longitude: 4.485384,
  });
  // State to store the selected marker's location.
  const [markerLocation, setMarkerLocation] = useState({
    latitude: 51.916831,
    longitude: 4.472158,
  });
  // Setting origin and destination coordinates for map directions.
  const origin = {
    latitude: userLocation.latitude,
    longitude: userLocation.longitude,
  };

  const destination = {
    latitude: markerLocation.latitude,
    longitude: markerLocation.longitude,
  };
  // Google Maps API key for directions.
  const GOOGLE_MAPS_APIKEY = "";
  const character = props.characters.find((item) => {
    return item.id === id;
  });

  // Use the "useTheme" hook from "react-native-paper" to get the current theme.
  const theme = useTheme();
  // Camera configuration for the map.
  const camera = {
    center: {
      latitude: id !== "" && character ? character.latitude : 51.9225, // Latitude of Rotterdam
      longitude: id !== "" && character ? character.longitude : 4.47917,
    },
    pitch: 1,
    heading: 1,
    altitude: id != "" ? 3 : 1,
  };
  // Initial region for the map view.
  const initialRegion = {
    latitude: 51.9225, // Latitude of Rotterdam
    longitude: 4.47917, // Longitude of Rotterdam
    latitudeDelta: 0.05, // Zoom level (adjust as needed)
    longitudeDelta: 0.05, // Zoom level (adjust as needed)
  };
  return (
    <MapView
      userInterfaceStyle={theme.dark == true ? "dark" : "light"}
      style={styles.map}
      initialRegion={initialRegion}
      camera={camera}
      showsUserLocation={true}
      showsCompass={true}
      loadingEnabled={true}
      tintColor="#aa1428"
      onUserLocationChange={(e) => {
        setUserLocation({
          latitude: e.nativeEvent.coordinate.latitude,
          longitude: e.nativeEvent.coordinate.longitude,
        });
      }}
      onLongPress={(e) => console.log(e.nativeEvent)}
    >
      {props.characters.map((marker) => (
        <Marker
          key={marker.id}
          onSelect={(e) => {
            console.log(e.nativeEvent);
            setMarkerLocation({
              latitude: e.nativeEvent.coordinate.latitude,
              longitude: e.nativeEvent.coordinate.longitude,
            });
          }}
          coordinate={{
            latitude: marker.latitude,
            longitude: marker.longitude,
          }}
          title={marker.name}
          description={marker.description}
          pinColor="#000000"
        >
          <Image
            source={{ uri: marker.url }}
            style={{ height: 35, width: 35 }}
          />
          <Callout
            tooltip
            style={styles.calloutContainer}
            onPress={() => {
              console.log("Callout pressed");
            }}
          >
            <View>
              <Text style={styles.calloutTitle}>{marker.name}</Text>
              <Text style={styles.calloutDescription}>
                {marker.description}
              </Text>
              <Pressable style={styles.calloutButton} onPress={pickImage}>
                <Text style={styles.calloutButtonText}>
                  Add a nice photo for our heroes! {"\n"}
                  <Ionicons name="camera-sharp" size={30} />
                </Text>
              </Pressable>
            </View>
            <Image source={image} style={styles.calloutImage} />
          </Callout>
        </Marker>
      ))}

      <MapViewDirections
        language="en"
        mode="DRIVING"
        precision="high"
        origin={origin}
        destination={destination}
        apikey={GOOGLE_MAPS_APIKEY}
        strokeWidth={6}
        strokeColor="hotpink"
      />
    </MapView>
  );
}
// Styles for the component.
const styles = StyleSheet.create({
  map: {
    width: "100%",
    height: "100%",
  },
  calloutContainer: {
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    padding: 10,
    width: 250,
    height: "auto",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  calloutContent: {
    flex: 1,
    marginRight: 10,
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  calloutDescription: {
    fontSize: 14,
    marginBottom: 5,
  },
  calloutImage: {
    height: 80,
    width: 80,
    resizeMode: "cover",
    borderRadius: 10,
  },
  calloutButton: {
    backgroundColor: "#000042",
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 10,
  },
  calloutButtonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
});
