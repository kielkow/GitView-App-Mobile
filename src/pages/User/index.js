import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ActivityIndicator } from 'react-native';
import api from '../../services/api';

import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  Stars,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author,
} from './styles';

export default class User extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('user').name,
  });

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
    }).isRequired,
  };

  state = {
    stars: [],
    loading: false,
    page: 1,
    refreshing: false,
  };

  async componentDidMount() {
    const { navigation } = this.props;
    const user = navigation.getParam('user');

    this.setState({ loading: true });

    const response = await api.get(`/users/${user.login}/starred`);

    this.setState({ stars: response.data, loading: false });
  }

  handleNavigate = starred => {
    const { navigation } = this.props;

    navigation.navigate('Starred', { starred });
  };

  async loadMore() {
    const { navigation } = this.props;
    const user = navigation.getParam('user');
    const { page } = this.state;

    this.setState({ page: page + 1 });

    // https://api.github.com/users/diego3g/starred?page=2

    const response = await api.get(`/users/${user.login}/starred`, {
      page,
    });

    this.setState({ stars: response.data });
  }

  async refreshList() {
    const { navigation } = this.props;
    const user = navigation.getParam('user');

    this.setState({ loading: true, refreshing: true });

    const response = await api.get(`/users/${user.login}/starred`);

    this.setState({ stars: response.data, loading: false, refreshing: false });
  }

  render() {
    const { navigation } = this.props;
    const { stars, loading, refreshing } = this.state;

    const user = navigation.getParam('user');

    return (
      <Container>
        <Header>
          <Avatar source={{ uri: user.avatar }} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>

        <Stars
          onEndReachedThreshold={0.2}
          onEndReached={this.loadMore}
          onRefresh={this.refreshList}
          refreshing={refreshing}
          data={stars}
          keyExtractor={star => String(star.id)}
          loading={loading}
          renderItem={
            loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              ({ item }) => (
                <Starred onPress={() => this.handleNavigate(item)}>
                  <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
                  <Info>
                    <Title>{item.name}</Title>
                    <Author>{item.owner.login}</Author>
                  </Info>
                </Starred>
              )
            )
          }
        />
      </Container>
    );
  }
}
