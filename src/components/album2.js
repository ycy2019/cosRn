import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Text, View, PermissionsAndroid, Platform, Modal, StyleSheet, ScrollView, Image, TouchableWithoutFeedback, FlatList, TouchableOpacity, TouchableNativeFeedback,Alert } from 'react-native';
import CameraRoll from "@react-native-community/cameraroll";
import Upload from './Upload';
// import { Checkbox, NativeBaseProvider } from "native-base"
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

function album({ route }) {
    const { albumList } = route.params;

    const [test, settest] = useState(0);
    const [currentAlbum, setCurrentAlbum] = useState({ title: "Camera" });
    const [photoListState, setPhotoListState] = useState([]);
    const [albummodalVisible, setAlbummodalVisible] = useState(false);
    const [selectPhotoState, setSelectPhotoState] = useState({});
    const [albumState, setAlbumState] = useState(() => {
        let data = JSON.parse(JSON.stringify(albumList))
        for (let i = 0; i < data.length; i++) {
            let item = data[i];
            let options = {
                first: 1,
                groupTypes: 'All',
                assetType: 'Photos',
                groupTypes: "Album",
                groupName: item.title
            }
            CameraRoll.getPhotos(options).then(function (LastPhoto) {
                item.photo = LastPhoto.edges[0]?.node;
            });

        }
        return data
    });

    // useEffect(() => {
    //     console.log(1)
    //     setDefaultAlbum()//设置相册信息
    // }, [currentAlbum.title])

    useEffect(() => {
        // console.log(2)
        getPhotoList()//设置相册信息
    }, [currentAlbum.title])

    // async function setDefaultAlbum() {
    //     if (Platform.OS === 'android' && !(await hasAndroidPermission())) {
    //         console.log("unable")
    //         return;
    //     }

    //     for (let i = 0; i < albumList.length; i++) {
    //         let item = albumList[i];
    //         let options = {
    //             first: 1,
    //             groupTypes: 'All',
    //             assetType: 'Photos',
    //             groupTypes: "Album",
    //             groupName: item.title
    //         }
    //         let LastPhoto = await CameraRoll.getPhotos(options);
    //         item.photo = LastPhoto.edges[0]?.node
    //     }
    //     setAlbumState(albumList);
    // }

    const upload = async function () {
        console.log(selectPhotoState)
        let fileUrl = Object.keys(selectPhotoState)[0].replace("file://", "");
        console.log(fileUrl);
        let fileName = fileUrl.split("/").slice(-1)[0]
        console.log(fileName)
        let data = await Upload.upload(fileUrl,fileName);
        Alert.alert(
            "Alert Title",
            data
          );
        console.log(data)
    };

    const AlbumHeader = function () {
        // console.log(Object.keys(selectPhotoState))
        return (<View style={{ flexDirection: "row", justifyContent: 'space-between', alignItems: "center", paddingVertical: 15, paddingHorizontal: 25 }}>
            <View>
                <Text style={{ fontSize: 13, color: "transparent" }} onPress={() => { settest(a => a + 1); }}>全选</Text>
            </View>
            <View>
                {Object.keys(selectPhotoState).length ?
                    <Text style={{ fontSize: 16, fontWeight: "600", padding: 10 }}>已选{Object.keys(selectPhotoState).length}张</Text> :
                    <Text style={{ fontSize: 16, fontWeight: "600", padding: 10 }} onPress={() => { setAlbummodalVisible(true) }}>相册</Text>}
            </View>
            <View>
                <Text style={Object.keys(selectPhotoState).length ? styles.uploadEnable : styles.uploadDisable} onPress={upload}>上传</Text>
            </View>
        </View>)
    };

    const remakePhoto = (photo) => {
        let data = JSON.parse(JSON.stringify(selectPhotoState));
        // console.log(data)
        // console.log(photo.image?.uri)
        if (data[photo.image?.uri]) {
            // console.log(1)
            //去除选中的图片
            delete data[photo.image?.uri]
            setSelectPhotoState(data)
        } else {
            // console.log(2)
            data[photo.image?.uri] = true;
            setSelectPhotoState(data)
            //选中了未被选中的图片
        }
        // console.log(data)
    }

    function albumListNode() {//渲染相册组件
        return (albumState.map((item) => {
            return <TouchableWithoutFeedback onPress={() => { setCurrentAlbum(item) }} key={item.title}>
                <View style={{ flex: 1, flexDirection: "row", marginVertical: 10, position: "relative" }}>
                    <Image
                        style={{
                            width: 50,
                            height: 50,
                            borderRadius: 10
                        }}
                        source={{
                            uri: item.photo?.image?.uri,
                        }}
                    />
                    <View style={{ marginLeft: 15 }}>
                        <Text style={{ fontWeight: "bold" }}>{item.title}</Text>
                        <Text style={{ fontSize: 10 }}>{item.count}</Text>
                    </View>
                    {currentAlbum.title == item.title && <Image
                        style={{
                            width: 20,
                            height: 20,
                            alignSelf: "center",
                            position: "absolute",
                            right: 5
                        }}
                        source={require("../assets/image/tick.png")}
                    />}
                </View>
            </TouchableWithoutFeedback>
        }))
    }



    function getPhotoList() {
        let options = {
            first: currentAlbum.count || 50,
            // first: 2,
            groupTypes: 'All',
            // assetType: 'Photos',
            groupTypes: "Album",
            groupName: currentAlbum.title
        }
        let dateIndexMapping = {};
        CameraRoll.getPhotos(options).then(function (data) {
            let photosFormatByDate = data.edges.reduce(function (list, item) {
                let photoDate = moment(item.node.timestamp * 1000).format("YYYY年MM月DD日")
                if (dateIndexMapping[photoDate]) {
                    list[dateIndexMapping[photoDate] - 1]?.data?.push(item.node);
                } else {
                    let index = Object.keys(dateIndexMapping).length + 1;
                    dateIndexMapping[photoDate] = index;
                    list[index - 1] = {
                        title: photoDate,
                        data: [item.node]
                    }
                }
                return list
            }, [])
            console.log(photosFormatByDate[0].data)
            setPhotoListState(photosFormatByDate)
        })
    }

    const photoList = function () {
        const renderItem = ({ item }) => (
            <View>
                <Text style={{ marginLeft: 25, fontSize: 12, paddingVertical: 10 }}>{item.title}</Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                    {item.data.map((photo, index) => {
                        return <TouchableOpacity key={index} onPress={() => { remakePhoto(photo) }} activeOpacity={0.8}>
                            <View style={{ marginBottom: 4, marginLeft: index % 4 == 0 ? 0 : 4, position: "relative" }}>
                                <Image
                                    style={{
                                        width: 95,
                                        height: 95,
                                        transform: selectPhotoState[photo.image?.uri] ? [{ scale: 0.9 }] : []
                                    }}
                                    source={{
                                        uri: photo.image?.uri,
                                    }}
                                />
                                {selectPhotoState[photo.image?.uri] && <Image
                                    style={{
                                        width: 20,
                                        height: 20,
                                        alignSelf: "center",
                                        position: "absolute",
                                        right: 7,
                                        bottom: 7
                                    }}
                                    source={require("../assets/image/tick.png")}
                                />}
                            </View>
                        </TouchableOpacity>
                    })}
                </View>
            </View>
        );
        return (
            // <Checkbox.Group>
            <FlatList
                data={photoListState}
                renderItem={renderItem}
                getItemLayout={(data, index) => (
                    { length: 95, offset: 95 * index, index }
                )}
                keyExtractor={(item) => {
                    return item.title
                }}
                extraData={Object.keys(selectPhotoState)}
            />
            // </Checkbox.Group>
        )
    }

    return (
        <View style={{ flex: 1 }}>
            {/* 遮罩 */}
            {/* <TouchableWithoutFeedback onPress={() => { setAlbummodalVisible(false) }}><View style={styles.modalMask}></View></TouchableWithoutFeedback> */}


            <Modal
                animationType="slide"
                visible={albummodalVisible}
                transparent={true}
                onRequestClose={() => {
                    setAlbummodalVisible(false)
                }}>
                <TouchableWithoutFeedback onPress={() => { setAlbummodalVisible(false) }}><View style={styles.modalMask}></View></TouchableWithoutFeedback>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalTitle}>选择相册</Text>
                        <View style={styles.modalContent}>
                            <ScrollView showsVerticalScrollIndicator={false}>
                                {albumListNode()}
                            </ScrollView>
                        </View>
                    </View>
                </View>
            </Modal>
            <AlbumHeader />
            {/* {albumHeader()} */}
            {photoList()}

            {/* <Checkbox.Group>
                <Checkbox value="one" my={2}> </Checkbox>
                <Checkbox value="two">Software Development</Checkbox>
            </Checkbox.Group> */}
        </View>
    );
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "flex-end",
        // backgroundColor: 'rgba(0, 0, 0, 0.15)',

    },
    modalMask: {
        position: "absolute",
        backgroundColor: 'rgba(0, 0, 0, 0.15)',
        width: "100%",
        height: 2000,
        top: -500
    },
    modalView: {
        width: 350,
        height: 530,
        margin: 25,
        backgroundColor: "white",
        borderRadius: 9,
        shadowOffset: {
            width: 0,
            height: 2
        },
        padding: 20
        // shadowOpacity: 0.25,
        // shadowRadius: 3.84,
        // elevation: 5
    },
    modalTitle: {
        textAlign: "center",
        fontSize: 13,
        color: "black",
        fontWeight: "800"
    },
    modalContent: {
        flex: 1,
        // flexDirection:"column"
        // backgroundColor: "gray"
    },
    showMatk: {
        display: "block"
    },
    hideMark: {
        display: "none"
    },
    uploadDisable: {
        padding: 6,
        borderRadius: 5,
        fontSize: 13,
        color: "#B8B8B8"
    },
    uploadEnable: {
        padding: 6,
        borderRadius: 5,
        fontSize: 13,
        color: "white",
        backgroundColor: '#258dc5'
    },
    text: {
        fontSize: 42,
    },
});
export default album