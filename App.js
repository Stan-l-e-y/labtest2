import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  Button,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Welcome' }}
        />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const Item = ({ title }) => (
  <View style={styles.item}>
    <Text style={styles.title}>{title}</Text>
  </View>
);

const HomeScreen = ({ navigation }) => {
  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('Profile', { name: 'Jane', item })}
    >
      <Item title={item.title} />
    </TouchableOpacity>
  );

  const [albums, setAlbums] = React.useState([]);

  React.useEffect(() => {
    const fetchAlbums = async () => {
      const albums = await fetch('https://jsonplaceholder.typicode.com/albums');
      const albumsJson = await albums.json();
      setAlbums(albumsJson);
    };
    fetchAlbums();
  }, [setAlbums]);

  return (
    <SafeAreaView>
      <Text style={styles.title}>Stanley Tsonev - 101339387</Text>
      {albums ? (
        <FlatList
          data={albums}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <Text>test</Text>
      )}
    </SafeAreaView>
  );
};

const ProfileScreen = ({ navigation, route }) => {
  React.useLayoutEffect(() => {
    navigation.setOptions({ title: route.params.item.title });
  }, [navigation, route]);

  const [userName, setUserName] = React.useState(null);

  useEffect(() => {
    const fetchUserName = async () => {
      const user = await fetch(
        `https://jsonplaceholder.typicode.com/users/${route.params.item.userId}`
      );
      const userJson = await user.json();
      setUserName(userJson.name);
    };
    fetchUserName();
  }, [route.params.item, setUserName]);

  return (
    <SafeAreaView>
      <Text>ID:{route.params.item.id}</Text>
      <Text>User ID:{route.params.item.userId}</Text>
      <Text>Title:{route.params.item.title}</Text>

      <Text>Username: {userName ? userName : 'username'}</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
});
