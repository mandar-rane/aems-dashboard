import {Stack} from 'expo-router';

const Layout = () => {
    return (
    <Stack 
        screenOptions={{ headerShown: false, statusBarHidden: true }}
    >
        <Stack.Screen name="index" />
        <Stack.Screen name="sessionPage"/>
        
        
      </Stack>)
}

export default Layout;