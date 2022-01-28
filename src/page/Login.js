import React, { useState, useEffect } from 'react';
import { Button, Text, View, PermissionsAndroid, Platform, TouchableWithoutFeedback, Image, StyleSheet, TextInput } from 'react-native';

function Login({ navigation }) {
    const [account, setAccountState] = useState('');
    const [password, setPasswordState] = useState('');

    return (
        <View style={{ flex: 1, alignItems: "center", position: "relative", backgroundColor: "white" }}>

            <View style={{ justifyContent: "center", alignItems: "center", marginTop: 100 }}>
                <Text style={styles.loginTitle}>使用账号密码登录</Text>
                <TextInput
                    style={styles.loginInput}
                    placeholder="请输入账户名/手机号"
                    onChangeText={text => setAccountState(text)}
                    keyboardType="default"
                    value={account}
                />
                <TextInput
                    style={{ ...styles.loginInput, marginTop: 30 }}
                    placeholder="请输入密码"
                    onChangeText={text => setPasswordState(text)}
                    secureTextEntry
                    value={password}
                />
                <Image source={require("../assets/image/login/next.png")} style={styles.loginButton} />
            </View>

            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: 280 }}>
                <Text style={{ color: "gray" }}>忘记密码</Text>
                <Text style={{ color: "gray" }} >注册</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    loginTitle: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 45
    },
    loginInput: {
        width: 280,
        height: 40,
        borderColor: 'rgba(0, 0, 0, 0.15)',
        borderBottomWidth: 1,
        fontSize: 17,
        // padding: 5
    },
    loginButton: {
        width: 65,
        height: 65,
        marginVertical: 50
    }
});

export default Login