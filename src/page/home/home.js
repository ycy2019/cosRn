import React, { useState, useEffect } from 'react';
import { Button, Text, View, PermissionsAndroid, Platform, TouchableWithoutFeedback, Image } from 'react-native';
import CameraRoll from "@react-native-community/cameraroll";
import { BoxShadow, BorderShadow } from 'react-native-shadow'


//检查权限
const hasAndroidPermission = async () => {
    const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

    const hasPermission = await PermissionsAndroid.check(permission);

    if (hasPermission) {
        return true;
    }

    const status = await PermissionsAndroid.request(permission);
    return status === 'granted';
};

const shadowOpt = {
    width: 50,
    height: 50,
    color: "#B8B8B8",
    border: 8,
    radius: 25,
    opacity: 0.5,
    x: 1,
    y: 5
}
function Home({ navigation }) {
    // const [albumList, setAlbumList] = useState([]);
    async function goAlbum() {
        if (Platform.OS === 'android' && !(await hasAndroidPermission())) {
            console.log("没有权限")
            return;
        }

        CameraRoll.getAlbums().then(async (albumList) => {
            albumList.sort(function (a, b) {
                return b.count - a.count
            });

            navigation.navigate("Albunm", {
                albumList
            })
        }).catch((err) => {
            console.log(err)
        })
    }
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', position: "relative", backgroundColor: "white" }}>
            <Text>Home!</Text>
            <Button title='登录' onPress={() => { navigation.navigate("Login") }}></Button>
            {/* <Button title='go albunm' onPress={goAlbum}></Button> */}
            <TouchableWithoutFeedback onPress={goAlbum}>
                <View style={{
                    position: "absolute",
                    bottom: 25,
                    right: 20
                }}>

                    <BoxShadow setting={shadowOpt} >
                        <Image
                            style={{
                                width: 50,
                                height: 50,
                                // position: "absolute",
                                // bottom: 25,
                                // right: 20
                            }}
                            source={require("../../assets/image/home/add.png")}
                        />
                    </BoxShadow>
                </View>

            </TouchableWithoutFeedback>
        </View>
    );
}

export default Home