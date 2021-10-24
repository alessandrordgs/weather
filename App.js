import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import * as Location from "expo-location";
import axios from "axios";

export default function App() {
  const [locationInital, setLocation] = useState({});
  const [weather, setWeather] = useState({});
  const [errorMsg, setErrorMsg] = useState();
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to acess location was denied");
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();

    (async () => {
      await axios
        .get(
          `https://api.openweathermap.org/data/2.5/onecall?lat=${locationInital.coords.latitude}&lon=${locationInital.coords.longitude}&appid=4c47d1f76b376ee2f5d0985995ceb386&units=metric`
        )
        .then((response) => {
          const { current, alerts } = response.data;
          setWeather(current);
          setAlerts(alerts);
        });
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Text>{weather.temp}ºC</Text>
      <View>
        <Text>{weather.wind_speed} m/s</Text>
        <Text>{weather.humidity}%</Text>
        <Text>{weather.feels_like}ºC Sensação termica</Text>
      </View>

      <View>
        <Text>{alerts[0].event}</Text>
        <Text>{alerts[0].description}</Text>
        <Text>{alerts[0].sender_name}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(23, 38, 49, 0.76)",
    alignItems: "center",
    justifyContent: "center",
  },
});
