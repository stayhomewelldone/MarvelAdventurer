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
import React from "react";
import { StyleSheet, Text, View, Image, SafeAreaView } from "react-native";

export default function Detail(props) {
  // Access the current theme using the useTheme hook
  const theme = useTheme();

  // Extract the 'id' parameter from the route
  const { id } = props.route.params;

  // Find the character with the matching id in the characters array
  const character = props.characters.find((item) => item.id === id);

  return (
    // Animate the view using the RollInLeft animation when it enters the screen
    <Animated.View entering={RollInLeft} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        {/* Display the character's name with the current text color from the theme */}
        <Text style={[styles.name, { color: theme.colors.text }]}>
          Name: {character.name}
        </Text>

        {/* Display the character's description with the current text color from the theme */}
        <Text style={[styles.description, { color: theme.colors.text }]}>
          Description: {character.description}
        </Text>

        {/* Display the character's comics count with the current text color from the theme */}
        <Text style={[styles.info, { color: theme.colors.text }]}>
          Comics: {character.comics}
        </Text>

        {/* Display the character's series count with the current text color from the theme */}
        <Text style={[styles.info, { color: theme.colors.text }]}>
          Series: {character.series}
        </Text>

        {/* Display the character's events count with the current text color from the theme */}
        <Text style={[styles.info, { color: theme.colors.text }]}>
          Events: {character.events}
        </Text>

        {/* Display the character's image */}
        <Image
          style={styles.image}
          source={{
            uri: character.url,
          }}
        />
      </SafeAreaView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  safe: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 10,
  },
  info: {
    fontSize: 14,
    marginBottom: 5,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginTop: 20,
  },
});
