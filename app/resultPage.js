import { View, Text, Pressable, Alert, Image, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useGlobalSearchParams } from "expo-router";

const resultPage = () => {
  const router = useRouter();
  const params = useGlobalSearchParams();

  return (
    <View style={{ padding: 10 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>Session Results</Text>

      <View style={{ flexDirection: "column"}}>
      <View style={{ flexDirection: "row", marginTop:20}}>
          <View
            style={{
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              borderColor: "black",
              borderWidth: 1,
              borderRadius: 10,
              margin: 10,
              padding: 20,
              flex: 1,
              height: 100,
            }}
          >
            <Image
              source={require("../assets/person.png")}
              style={{
                width: 250,
                resizeMode: "contain"
                
              }}
            />
            <Text style={{fontSize:16}}>Prof. Alex</Text>
            <Text style={{fontWeight:"bold"}}>Lecturer Name</Text>
            
          </View>

          <View
            style={{
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              borderColor: "black",
              borderWidth: 1,
              borderRadius: 10,
              margin: 10,
              padding: 10,
              flex: 1,
              height: 100,
            }}
          >
            <Image
              source={require("../assets/clock.png")}
              style={{
                width: 250,
                resizeMode: "contain",
              }}
            />
            <Text style={{fontSize:16}}>40m</Text>
            <Text style={{fontWeight:"bold"}}>Duration</Text>
          </View>
        </View>
        
        <View style={{ flexDirection: "row", marginTop:20}}>
          <View
            style={{
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              borderColor: "black",
              borderWidth: 1,
              borderRadius: 10,
              margin: 10,
              padding: 10,
              flex: 1,
              height: 100,
            }}
          >
            <Image
              source={require("../assets/clock.png")}
              style={{
                width: 250,
                resizeMode: "contain",
              }}
            />
            <Text style={{fontSize:16}}>1:35 PM</Text>
            <Text style={{fontWeight:"bold"}}>Start Time</Text>
          </View>

          <View
            style={{
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              borderColor: "black",
              borderWidth: 1,
              borderRadius: 10,
              margin: 10,
              padding: 10,
              flex: 1,
              height: 100,
            }}
          >
            <Image
              source={require("../assets/clock.png")}
              style={{
                width: 250,
                resizeMode: "contain",
              }}
            />
            <Text style={{fontSize:16}}>2:15 PM</Text>
            <Text style={{fontWeight:"bold"}}>End Time</Text>
          </View>
        </View>

        <View style={{ flexDirection: "row", marginTop:20}}>
          <View
            style={{
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              borderColor: "black",
              borderWidth: 1,
              borderRadius: 10,
              margin: 10,
              padding: 10,
              flex: 1,
              height: 120,
            }}
          >
            <Image
              source={require("../assets/attention_icon.png")}
              style={{
                width: 250,
                resizeMode: "contain",
              }}
            />
            <Text style={{fontSize:26, fontWeight:"bold"}}>79%</Text>
            <Text style={{fontWeight:"bold"}}>Average Session Attention</Text>
          </View>



          
        </View>
        <View style={{ flexDirection: "row", marginTop:20}}>
          <View
            style={{
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              borderColor: "black",
              borderWidth: 1,
              borderRadius: 10,
              margin: 10,
              padding: 10,
              flex: 1,
              height: 120,
            }}
          >
            <Image
              source={require("../assets/attendance_icon.png")}
              style={{
                width: 250,
                resizeMode: "contain",
              }}
            />
            <Text style={{fontSize:26, fontWeight:"bold"}}>34</Text>
            <Text style={{fontWeight:"bold"}}>Average Session Attendance</Text>
          </View>

          

          
        </View>
        

      </View>

      
        
        
    </View>
  );
};

export default resultPage;
