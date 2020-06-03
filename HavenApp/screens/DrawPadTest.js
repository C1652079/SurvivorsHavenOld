import React, { useState, useEffect } from 'react';
import {
  Dimensions,
  View,
  StyleSheet,
  TouchableOpacity,
  PanResponder,
  FlatList,
} from 'react-native';
import Colors from '../constants/Colors';
import { FontAwesome } from '@expo/vector-icons';
import Svg, { G, Path } from 'react-native-svg';

const DrawPadTest = (props) => {
  const [color, setColor] = useState(Colors.color16);
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [donePaths, setDonePaths] = useState([]);
  const [currentMax, setCurrentMax] = useState(0);
  const [currentPoints, setCurrentPoints] = useState([]);

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gs) => true,
    onPanResponderGrant: (evt, gs) => onResponderGrant(evt, gs),
    onPanResponderMove: (evt, gs) => onResponderMove(evt, gs),
    onPanResponderRelease: (evt, gs) => onResponderRelease(evt, gs),
  });

  const allColors = Object.keys(Colors);
  let offsetX = 0;
  let offsetY = 0;
  let currentContent;

  useEffect(() => {
    currentContent = (
      <Path
        key={Math.random()}
        d={convertPointsToSvg(currentPoints)}
        stroke={color}
        strokeWidth={strokeWidth}
      />
    );
  }, [currentPoints]);

  const convertPointsToSvg = (points) => {
    if (points.length > 0) {
      let path = `M ${points[0].x - offsetX},${points[0].y - offsetY}`;
      points.forEach((point) => {
        path = `${path} L ${point.x - offsetX},${point.y - offsetY}`;
      });
      return path;
    } else {
      return '';
    }
  };

  const onTouch = (evt) => {
    let [x, y] = [evt.nativeEvent.pageX, evt.nativeEvent.pageY];
    const newCurrentPoints = currentPoints;
    newCurrentPoints.push({ x, y });

    setCurrentPoints(newCurrentPoints);
    setDonePaths(donePaths);
    setCurrentMax(currentMax);
  };

  const onResponderGrant = (evt) => {
    onTouch(evt);
  };

  const onResponderMove = (evt) => {
    onTouch(evt);
  };

  const onResponderRelease = () => {
    const newPaths = donePaths;
    const newMax = currentMax + 1;

    if (currentPoints.length > 0) {
      newPaths.push(
        <Path
          key={Math.random()}
          d={convertPointsToSvg(currentPoints)}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
        />
      );
    }

    setDonePaths(newPaths);
    setCurrentPoints([]);
    setCurrentMax(newMax);
  };

  const onLayoutContainer = (e) => {
    offsetX = e.nativeEvent.layout.x;
    offsetY = e.nativeEvent.layout.y + e.nativeEvent.layout.height / 10;
  };

  const renderColors = (itemData) => {
    return (
      <TouchableOpacity
        key={itemData.item}
        style={[styles.colorOption, { backgroundColor: Colors[itemData.item] }]}
        onPress={() => changeColor(Colors[itemData.item])}
      />
    );
  };

  const clearScreen = () => {
    setDonePaths([]);
  };

  const undo = () => {
    setDonePaths(donePaths.slice(0, -1));
  };

  const changeColor = (color) => {
    setColor(color);
  };

  return (
    <View style={styles.container}>
      <View>
        <FlatList
          data={allColors}
          keyExtractor={(item, index) => item}
          renderItem={renderColors}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        />
      </View>

      <View {...panResponder.panHandlers} onLayout={onLayoutContainer}>
        <Svg
          width={Dimensions.get('window').width}
          height={Dimensions.get('window').height - 190}
        >
          {donePaths.map((path) => path)}
          {currentContent}
        </Svg>
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity onPress={undo}>
          <FontAwesome name="undo" size={30} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={clearScreen}>
          <FontAwesome name="remove" size={30} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  buttonsContainer: {
    margin: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  colorOption: {
    width: 30,
    height: 30,
    margin: 10,
    borderRadius: 20,
  },
});

export default DrawPadTest;
