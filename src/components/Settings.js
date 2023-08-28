// Importing necessary modules and components from "react-native".
import { StyleSheet, Text, View, Switch } from "react-native";

// Importing React and useContext hook from "react".
import React, { useContext } from "react";

// Importing useTheme hook from "react-native-paper".
import { useTheme } from "react-native-paper";

// Importing PreferencesContext from "../utils/PreferencesContext".
import { PreferencesContext } from "../utils/PreferencesContext";

// Importing necessary components and utilities from "react-native-reanimated".
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
  PinwheelIn,
  FlipInYRight,
} from "react-native-reanimated";

// Settings component that renders the settings view.
export default function Settings({ route, navigation }) {
  const theme = useTheme();
  const { toggleTheme, isThemeDark } = useContext(PreferencesContext);

  // Returning a view with animated styles, displaying the settings UI including the title, current theme text, a switch to toggle the theme, and appropriate styling based on the theme and user preferences.
  return (
    <Animated.View entering={FlipInYRight} style={styles.container}>
      <Text style={[styles.title, { color: theme.colors.text }]}>Settings</Text>
      <Text style={[styles.themeText, { color: theme.colors.text }]}>
        Current Theme: {theme.dark == true ? "Dark" : "Light"}
      </Text>
      <View style={styles.settingRow}>
        <Text style={[styles.settingText, { color: theme.colors.text }]}>
          {theme.dark == true ? "Light Theme" : "Dark Theme"}
        </Text>
        <Switch
          trackColor={{ false: "#767577", true: "#000042" }}
          thumbColor="#aa1428"
          ios_backgroundColor="#3e3e3e"
          value={isThemeDark}
          onValueChange={toggleTheme}
        />
      </View>
    </Animated.View>
  );
}

// Styles for the Settings component.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    paddingBottom: 20,
  },
  themeText: {
    fontSize: 18,
    paddingBottom: 10,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
    width: "100%",
  },
  settingText: {
    fontSize: 16,
  },
});
