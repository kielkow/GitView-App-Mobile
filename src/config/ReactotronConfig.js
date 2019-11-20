import Reactotron from 'reactotron-react-native';

if (__DEV__) {
  const tron = Reactotron.configure() // If I´m using USB, is needed put inside
    // on configure({ host: 'device_ip' })
    .useReactNative()
    .connect();

  console.tron = tron;

  tron.clear();
}
