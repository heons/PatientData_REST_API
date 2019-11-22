package com.example.patientdataapp;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;

public class MainActivity extends AppCompatActivity {

    Button btnPatientList, btnRecordList;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        btnPatientList = (Button) findViewById(R.id.btnPatientList);
        btnRecordList = (Button) findViewById(R.id.btnRecordList);

    }

    public void onClickButtons(View view) {

        // Switch by view
        if (view == btnPatientList) {
            Intent intent = new Intent(this, PatientListActivity.class);
            startActivity(intent);
        } else if (view == btnRecordList) {
            Intent intent = new Intent(this, RecordListActivity.class);
            startActivity(intent);
        } else {}
    }


}
