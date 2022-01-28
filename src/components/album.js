import * as React from 'react';
import { Button, Text, View } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

async function showAlbum() {
    let options = {
        title:"选择图片",
        selectionLimit: 2,
        mediaType: "photo"
    }
    const result = await launchImageLibrary(options);
    console.log(result)
}

function album() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>album!</Text>
            <Button title='show' onPress={showAlbum}></Button>
        </View>
    );
}

export default album