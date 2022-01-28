package com.cosrn;

// import android.support.annotation.Nullable;

import com.tencent.cos.xml.*;
import com.tencent.cos.xml.common.*;
import com.tencent.cos.xml.exception.*;
import com.tencent.cos.xml.listener.*;
import com.tencent.cos.xml.model.*;
import com.tencent.cos.xml.model.object.*;
import com.tencent.cos.xml.model.bucket.*;
import com.tencent.cos.xml.model.tag.*;
import com.tencent.cos.xml.transfer.*;
import com.tencent.qcloud.core.auth.*;
import com.tencent.qcloud.core.common.*;
import com.tencent.qcloud.core.http.*;
import com.tencent.cos.xml.model.service.*;

import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;

import android.content.Context;
import android.util.Log;
// import android.support.test.InstrumentationRegistry;

// import org.junit.Test;

import java.net.*;
import java.util.*;
import java.nio.charset.Charset;
import java.io.*;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;

public class UploadObject extends ReactContextBaseJavaModule {
    private static ReactApplicationContext reactContext;
    private CosXmlService cosXmlService;
    
    public UploadObject(ReactApplicationContext context) {
        super(context);
        reactContext = context;
    }

    @Override
        public String getName() {
        return "UploadObject";
    }

    private void sendEvent(ReactContext reactContext, String eventName, WritableMap params) {
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, params);
    }
    /**
     * 获取存储桶列表
     */
    @ReactMethod
    private void upload(String fileUrl,String cosPath,Promise promise) {

        String defaultRegion = "ap-shanghai";
        String secretId = "AKIDs3fBbrL42aXRL3iarOhjeNrl6BVZLl23";
        String secretKey = "DrE4TcUAtNa5a9UaQH6sA7i4A4by4461";
        Boolean refresh = false;
        cosXmlService = CosServiceFactory.getCosXmlService(reactContext, defaultRegion, secretId, secretKey, refresh);
        // 初始化 TransferConfig，这里使用默认配置，如果需要定制，请参考 SDK 接口文档
        TransferConfig transferConfig = new TransferConfig.Builder().build();
        // 初始化 TransferManager
        TransferManager transferManager = new TransferManager(cosXmlService, transferConfig);
        String bucket = "yc-1302181823"; //存储桶名称，格式：BucketName-APPID
        // String cosPath = "IMG_20210716_204056.jpg"; //对象位于存储桶中的位置标识符，即对象键

        String srcPath = fileUrl;
        // String srcPath = new File(reactContext.getExternalCacheDir(), "1.jpg").toString();//"本地文件的绝对路径";
        //若存在初始化分块上传的 UploadId，则赋值对应的 uploadId 值用于续传；否则，赋值 null
        String uploadId = null;

        // 上传文件
        COSXMLUploadTask cosxmlUploadTask = transferManager.upload(bucket, cosPath, srcPath, uploadId);

        // //设置上传进度回调
        // cosxmlUploadTask.setCosXmlProgressListener(new CosXmlProgressListener() {
        //     @Override
        //     public void onProgress(long complete, long target) {
        //         // todo Do something to update progress...
        //     }
        // });
        //设置返回结果回调
        cosxmlUploadTask.setCosXmlResultListener(new CosXmlResultListener() {
            @Override
            public void onSuccess(CosXmlRequest request, CosXmlResult result) {
                        String list = "";
                COSXMLUploadTask.COSXMLUploadTaskResult uploadResult = (COSXMLUploadTask.COSXMLUploadTaskResult) result;
                list+=cosPath+"/";
                promise.resolve(list);
            }

            // 如果您使用 kotlin 语言来调用，请注意回调方法中的异常是可空的，否则不会回调 onFail 方法，即：
            // clientException 的类型为 CosXmlClientException?，serviceException 的类型为 CosXmlServiceException?
            @Override
            public void onFail(CosXmlRequest request, CosXmlClientException clientException, CosXmlServiceException serviceException) {
                if (clientException != null) {
                    clientException.printStackTrace();
                    promise.reject(clientException.toString());
                } else {
                    serviceException.printStackTrace();
                    promise.reject(serviceException.toString());
                }
                
            }
        });
        //.cssg-snippet-body-end
    }
}