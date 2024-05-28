import { View, Text, Pressable, Alert, Image, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";


const Home = () => {
  const router = useRouter();
  const [name, setName] = useState("");

  const onNameChange = (newName) => {
    setName(newName);
  };

  const handleSessionStart = () => {
    router.push({
      pathname: "sessionPage",
      params:{hostName: name}
    });
  };

  return (
    <View
      style={{
        height: "100%",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",

        flex: 2,
      }}
    >
      <View
        style={{
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
        }}
      >
        <Image
          source={require("../assets/banner.png")}
          style={{
            width: 320,
            resizeMode: "contain",
            marginBottom:20,
            marginTop:60
          }}
        />
        <Text
          style={{
            fontSize: 30,
            fontWeight: "bold",
            fontStyle: "italic",
            marginBottom: 20,
          }}
        >
          AEMS
        </Text>
        <Text
          style={{
            fontSize: 22,
            textAlign: "center",
            marginHorizontal: 20,
            marginBottom: 10,
          }}
        >
          Audience Engagement Monitoring System
        </Text>
        <Text
          style={{ fontSize: 16, textAlign: "center", marginHorizontal: 20 }}
        >
          by Group No: 31
        </Text>
      </View>
      <View
        style={{
          flexDirection: "column",
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image
            source={require("../assets/teacher_icon.png")}
            style={{ height: 45, width: 45, marginEnd: 10 }}
          />

          <TextInput
            placeholder="Enter Presenter/Lecturer Name"
            style={{
              width: "60%",
              height: 40,
              borderWidth: 1,
              borderColor: "gray",
              paddingHorizontal: 10,
              borderRadius: 10,
            }}
            onChangeText={onNameChange}
            value={name}
          ></TextInput>
        </View>

        <Pressable
          onPress={handleSessionStart}
          style={{
            backgroundColor: "black",
            width: 180,
            margin: 20,
            borderRadius: 10,
            height: 44,
            justifyContent: "center",

            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 18,
            }}
          >
            Start Session
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Home;
