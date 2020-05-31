import React from 'react';
import {
  Dimensions,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  PanResponder,
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

    this._panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gs) => true,
      onPanResponderGrant: (evt, gs) => this.onResponderGrant(evt, gs),
      onPanResponderMove: (evt, gs) => this.onResponderMove(evt, gs),
      onPanResponderRelease: (evt, gs) => this.onResponderRelease(evt, gs),
    });

    this._offsetX = 0;
    this._offsetY = 0;
  }

  shouldComponentUpdate(nextState) {
    if (this.state.donePaths !== nextState.donePaths) {
      return true;
    }
  }

  setOffset(options) {
    this._offsetX = options.x;
    this._offsetY = options.y + options.height / 1.8;
  }

  pointsToSvg(points) {
    const offsetX = this._offsetX;
    const offsetY = this._offsetY;

    if (points.length > 0) {
      let path = `M ${points[0].x - offsetX},${points[0].y - offsetY}`;
      points.forEach((point) => {
        path = `${path} L ${point.x - offsetX},${point.y - offsetY}`;
      });
      return path;
    } else {
      return '';
    }
  }

  onTouch(evt) {
    let [x, y] = [evt.nativeEvent.pageX, evt.nativeEvent.pageY];
    const newCurrentPoints = this.state.currentPoints;
    newCurrentPoints.push({ x, y });

    this.setState({
      donePaths: this.state.donePaths,
      currentPoints: newCurrentPoints,
      currentMax: this.state.currentMax,
    });
  }

  onResponderGrant(evt) {
    this.onTouch(evt);
  }

  onResponderMove(evt) {
    this.onTouch(evt);
  }

  onResponderRelease() {
    const newPaths = this.state.donePaths;
    const newMax = this.state.currentMax + 1;

    if (this.state.currentPoints.length > 0) {
      newPaths.push(
        <Path
          key={Math.random()}
          d={this.pointsToSvg(this.state.currentPoints)}
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
  }

  _onLayoutContainer = (e) => {
    this.setOffset(e.nativeEvent.layout);
  };

  _renderOptions() {
    const allColors = Object.keys(Colors);

    return allColors.map((color) => (
      <TouchableOpacity
        key={color}
        style={[styles.colorOption, { backgroundColor: Colors[color] }]}
        onPress={() => this._changeColor(Colors[color])}
      />
    ));
  }

  _cancel = () => {
    this.setState({ donePaths: [] });
  };

  _undo = () => {
    this.setState({ donePaths: this.state.donePaths.slice(0, -1) });
  };

  _changeColor = (color) => {
    this.setState({ color });
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <View style={styles.headerButtonsContainer}>
            <TouchableOpacity onPress={this._cancel}>
              <FontAwesome name="remove" style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={this._undo}>
              <FontAwesome name="undo" style={styles.icon} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.colorContainer}>{this._renderOptions()}</View>

        <View
          ref={(view) => {
            this._signatureView = view;
          }}
          style={{ alignItems: 'center' }}
        >
          <View
            onLayout={this._onLayoutContainer}
            style={[
              styles.drawContainer,
              { backgroundColor: '#FFF', marginTop: 10 },
              { width: this.props.width, height: this.props.height },
            ]}
          >
            <View {...this._panResponder.panHandlers}>
              <Svg
                style={styles.drawSurface}
                width={Dimensions.get('window').width - 20}
                height={Dimensions.get('window').width - 20}
              >
                <G>
                  {this.state.donePaths.map((path) => path)}
                  <Path
                    key={Math.random()}
                    d={this.pointsToSvg(this.state.currentPoints)}
                    stroke={this.state.color}
                    strokeWidth={this.state.strokeWidth}
                    fill="none"
                  />
                </G>
              </Svg>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'stretch',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  icon: {
    color: '#999',
    fontSize: 22,
    margin: 5,
  },
  headerContainer: {
    flexDirection: 'column',
    backgroundColor: '#EEE',
    paddingTop: 18,
    paddingBottom: 5,
  },
  headerButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 7,
    marginBottom: 3,
  },
  colorContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderColor: '#DDD',
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  colorOption: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginVertical: 5,
    marginHorizontal: 10,
  },
  image: {
    width: Dimensions.get('window').width / 3,
    height: Dimensions.get('window').width / 3,
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#ddd',
    borderBottomWidth: 0,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 2,
    margin: 10,
    marginRight: 0,
  },
  drawContainer: {
    borderWidth: 1,
    borderRadius: 2,
    borderColor: '#ddd',
    borderBottomWidth: 0,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },

  drawSurface: {
    backgroundColor: 'transparent',
  },
});
