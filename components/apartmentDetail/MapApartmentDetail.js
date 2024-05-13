import React, { useState } from "react";
import MapView, { Marker, Heatmap } from "react-native-maps";
import { StyleSheet, View, Text } from "react-native";
import { Dimensions } from "react-native";

export default function MapApartmentDetail({ latitude, longitude, apartment }) {
  const [mapLat, setMapLat] = useState(10.841328);
  const [mapLong, setMapLong] = useState(106.810473);

  return (
    <View style={styles.container}>
      {latitude && longitude && (
        <MapView
          initialRegion={{
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          style={styles.map}
          mapType="standard"
        >
          <Marker
            coordinate={{
              latitude: latitude,
              longitude: longitude,
            }}
            title={apartment?.property.propertyName}
            description={apartment?.property.propertyDescription}
            pinColor={"red"}
          />
        </MapView>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {},
  map: {
    width: Dimensions.get("window").width,
    height: 200,
  },
});
