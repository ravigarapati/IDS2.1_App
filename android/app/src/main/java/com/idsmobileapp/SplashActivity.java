package com.idsmobileapp;

import android.content.Intent;
import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;

public class SplashActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        Intent fcmIntent = this.getIntent();
        Bundle bundle = fcmIntent.getExtras();

        MainApplication application = (MainApplication) getApplication();
        if (!application.isActivityInBackStack(MainActivity.class)) {
            Intent intent = new Intent(this, MainActivity.class);
            intent.putExtras(fcmIntent);
            startActivity(intent);
        }
        
        finish();

    }
}