import React from 'react';
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

export default class SignatureScreen extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      color: Colors.color16,
      strokeWidth: 4,
      donePaths: [],
      currentMax: 0,
      currentPoints: [],
    };

    this.panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gs) => true,
      onPanResponderGrant: (evt, gs) => this.onTouch(evt, gs),
      onPanResponderMove: (evt, gs) => this.onTouch(evt, gs),
      onPanResponderRelease: (evt, gs) => this.onResponderRelease(evt, gs),
    });

    this.offsetX = 0;
    this.offsetY = 0;
    this.allColors = Object.keys(Colors);
  }

  convertPointsToSvg = (points) => {
    const offsetX = this.offsetX;
    const offsetY = this.offsetY;

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

  onTouch = (evt) => {
    let [x, y] = [evt.nativeEvent.pageX, evt.nativeEvent.pageY];
    const newCurrentPoints = this.state.currentPoints;
    newCurrentPoints.push({ x, y });

    this.setState({
      donePaths: this.state.donePaths,
      currentPoints: newCurrentPoints,
      currentMax: this.state.currentMax,
    });
  };

  onResponderRelease = () => {
    const newPaths = this.state.donePaths;
    const newMax = this.state.currentMax + 1;

    if (this.state.currentPoints.length > 0) {
      newPaths.push(
        <Path
          key={Math.random()}
          d={this.convertPointsToSvg(this.state.currentPoints)}
          stroke={this.state.color}
          strokeWidth={this.state.strokeWidth}
          fill="none"
        />
      );
    }

    this.setState({
      donePaths: newPaths,
      currentPoints: [],
      currentMax: newMax,
    });
  };

  onLayoutContainer = (e) => {
    this.offsetX = e.nativeEvent.layout.x;
    this.offsetY = e.nativeEvent.layout.y + e.nativeEvent.layout.height / 10;
  };

  renderColors = (itemData) => {
    return (
      <TouchableOpacity
        key={itemData.item}
        style={[styles.colorOption, { backgroundColor: Colors[itemData.item] }]}
        onPress={() => this.changeColor(Colors[itemData.item])}
      />
    );
  };

  clearScreen = () => {
    this.setState({ donePaths: [] });
  };

  undo = () => {
    this.setState({ donePaths: this.state.donePaths.slice(0, -1) });
  };

  changeColor = (color) => {
    this.setState({ color });
  };

  render() {
    return (
      <View style={styles.container}>
        <View>
          <FlatList
            data={this.allColors}
            keyExtractor={(item, index) => item}
            renderItem={this.renderColors}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
          />
        </View>

        <View
          {...this.panResponder.panHandlers}
          onLayout={this.onLayoutContainer}
        >
          <Svg
            width={Dimensions.get('window').width}
            height={Dimensions.get('window').height - 190}
          >
            <G>
              {this.state.donePaths.map((path) => path)}
              <Path
                key={Math.random()}
                d={this.convertPointsToSvg(this.state.currentPoints)}
                stroke={this.state.color}
                strokeWidth={this.state.strokeWidth}
                fill="none"
              />
            </G>
          </Svg>
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity onPress={this.undo}>
            <FontAwesome name="undo" size={30} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={this.clearScreen}>
            <FontAwesome name="remove" size={30} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

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
