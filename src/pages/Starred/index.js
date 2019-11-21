import React, { Component } from 'react';
import { WebView } from 'react-native-webview';
import PropTypes from 'prop-types';

import { Container, Header, Name } from './styles';

export default class Starred extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('starred').name,
  });

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
    }).isRequired,
  };

  render() {
    const { navigation } = this.props;
    const starred = navigation.getParam('starred');
    return (
      <>
        <Container>
          <Header>
            <Name>{starred.name}</Name>
          </Header>
          <WebView source={{ uri: starred.url }} style={{ flex: 1 }} />
        </Container>
      </>
    );
  }
}
