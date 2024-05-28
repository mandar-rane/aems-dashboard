import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Button,
  Alert,
  Pressable,
} from "react-native";
import io from "socket.io-client";
import { LineChart } from "react-native-chart-kit";
import axios from "axios";
import { Audio } from "expo-av";
import { useRouter } from "expo-router";
import { useGlobalSearchParams } from "expo-router";

const screenWidth = Dimensions.get("window").width;

const sessionPage = () => {
  const [data, setData] = useState([0]);
  const [currentAttendance, setCurrentAttendance] = useState(0);
  const [sound, setSound] = useState();
  const maxPts = 10;
  const param = useGlobalSearchParams();
  
  const router = useRouter();

  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [hostName, setHostName] = useState("");
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);


  useEffect(() => {
    startHeadPoseScript();
    setStartTime(new Date());
    setHostName(param.hostName);
  }, []);

  useEffect(() => {
    let interval;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);
  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setSeconds(0);
    setIsActive(false);
  };
  const handleSessionEnd = async () => {
    try {
      const response = await axios.post(
        "http://192.168.132.25:3000/stop-script"
      );

      if (response.status !== 200) {
        throw new Error("Failed to end Python script");
      }

      Alert.alert("Success", "Python script ended successfully");
      toggleTimer();
      console.log(seconds, "DURRRATION");
      setEndTime(new Date());
      
        router.replace({
        pathname: "resultPage",
        params:{hostName: hostName, startTime: startTime, endTime: endTime, seconds: seconds}
      });
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const startHeadPoseScript = async () => {
    toggleTimer();
    try {
      const response = await axios.post(
        "http://192.168.132.25:3000/start-python-script"
      );

      if (response.status !== 200) {
        throw new Error("Failed to execute Python script");
      }

      Alert.alert("Success", "Python script executed successfully");
      router.replace({
        pathname: "resultPage",
        // params:{hostName: hostName, startTime: startTime, endTime: endTime}
      });

    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  async function playSound() {
    console.log("Loading Sound");
    const { sound } = await Audio.Sound.createAsync(
      require("../assets/sounds/beep_sound.mp3")
    );
    setSound(sound);
    console.log("Playing Sound");
    await sound.playAsync();
  }

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  useEffect(() => {
    const socket = io("http://192.168.132.25:3000", {
      transports: ["websocket"],
    });

    socket.on("update_variable", (newData) => {
      if (newData < 50) {
        playSound();
      }

      setData((prevData) => {
        const newDataArray = [...prevData, newData].slice(-maxPts);
        return newDataArray;
      });
      console.log(`Recieved from server: ${newData}`);
    });

    socket.on("attendance", (newAttn) => {
      setCurrentAttendance(newAttn);
      console.log(`Attn Recieved from server: ${newAttn}`);
    })

    return () => socket.disconnect();
  }, []);

  return (
    <View style={{ flexDirection: "column", alignItems: "center" }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          marginTop: 10,
          marginBottom: 10,
        }}
      >
        <Text style={{ fontSize: 16, fontStyle: "italic", fontWeight: "bold" }}>
          Real-Time Attention Score 
        </Text>
      </View>

      <LineChart
        data={{
          labels: Array.from({ length: data.length }, (_, i) => i.toString()),
          datasets: [
            {
              data,
            },
          ],
        }}
        width={screenWidth}
        height={250}
        yAxisLabel=""
        yAxisInterval={1}
        chartConfig={{
          backgroundColor: "#000000",

          backgroundGradientFrom: "#000000",
          backgroundGradientTo: "#000000",
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(255, 255, 255, 0.7)`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: "3",
            strokeWidth: "1",
            stroke: "#ffffff",
          },
        }}
        bezier
        style={{
          margin: 10,
          borderWidth: 2,
          borderColor: "#000000",
          borderRadius: 5,
        }}
      />

      <View
        style={{
          marginTop: 40,
          width: "100%",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 20 }}>Attention Score : </Text>
        <Text style={{ fontSize: 60 }}>{data[data.length - 1]}%</Text>

        <Text style={{ fontSize: 20 }}>Realtime Attendance : </Text>
        <Text style={{ fontSize: 60 }}>{currentAttendance}</Text>

        <Text style={{ fontSize: 16 }}>Duration : </Text>
        <Text style={{ fontSize: 30 }}>{seconds}</Text>
      </View>
      <Pressable
        onPress={handleSessionEnd}
        style={{
          backgroundColor: "red",
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
          End Session
        </Text>
      </Pressable>
    </View>
  );
};

export default sessionPage;
