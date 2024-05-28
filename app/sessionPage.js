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
  const [hostName, setHostName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [startInSec, setStartInSec] = useState(0);

  const [dataSum, setDataSum] = useState(0);
  const [dataCount, setDataCount] = useState(0);
  const [attnSum, setAttnSum] = useState(0);
  const [attnCount, setAttnCount] = useState(0);

  const serverIpAddress = "http://192.168.132.25:3000";




  useEffect(() => {
    startHeadPoseScript();
    setHostName(param.hostName);
    setStartTime(param.startTime);
    setStartInSec(param.startInSec);
  }, []);


  const handleSessionEnd = async () => {
    try {
      const response = await axios.post(
        `${serverIpAddress}/stop-script`
      );

      if (response.status !== 200) {
        throw new Error("Failed to end Python script");
      }

      Alert.alert("Success", "Python script ended successfully");

      var endhour = new Date().getHours();
      var endmin = new Date().getMinutes();
      var endsec = new Date().getSeconds();

      var endInSec = (endhour * 60 * 60) + (endmin * 60) + endsec

      var endTime = endhour.toString() + ":" + endmin.toString();

      router.replace({
        pathname: "resultPage",
        params: {
          hostName: hostName, startTime: startTime, endTime: endTime, startInSec: startInSec,
          endInSec: endInSec, dataSum: dataSum, dataCount: dataCount, attnSum: attnSum, attnCount: attnCount
        }
        // , seconds: seconds}
      });

    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const startHeadPoseScript = async () => {
    try {
      const response = await axios.post(
        `${serverIpAddress}/start-python-script`
      );


      if (response.status !== 200) {
        throw new Error("Failed to execute Python script");
      }

      // Alert.alert("Success", "Python script executed successfully");

      // router.replace({
      //   pathname: "resultPage",
      //   params:{hostName: hostName, startTime: startTime, endTime: endTime}
      // });

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
    const socket = io(serverIpAddress, {
      transports: ["websocket"],
    });

    socket.on("update_variable", (newData) => {
      if (newData < 71) {
        playSound();
      }

      setData((prevData) => {
        const newDataArray = [...prevData, newData].slice(-maxPts);
        return newDataArray;
      });

      setDataSum(prevSum => prevSum + newData);
      setDataCount(prevCount => prevCount + 1);

      console.log(`Recieved from server: ${newData}`);
    });

    socket.on("attendance", (newAttn) => {
      setCurrentAttendance(newAttn);

      setAttnSum(prevSum => prevSum + newAttn);
      setAttnCount(prevCount => prevCount + 1);

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
          Real-Time Attention Score {hostName}
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
        <Text style={{ fontSize: 30 }}>100</Text>
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
