package com.jwbapp;
import android.os.Bundle;
import android.util.Log;
import com.facebook.react.ReactActivity;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import cn.jpush.android.api.JPushInterface;
public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "jwbapp";
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        JPushInterface.init(this);
        Log.i("MainActivity", "onCreate executed!");
    }

    @Override
    protected void onPause() {
        super.onPause();
        JPushInterface.onPause(this);
    }

    @Override
    protected void onResume() {
        super.onResume();
        JPushInterface.onResume(this);
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
    }
}
