package com.example.patientdataapp;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.AsyncTask;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.EditText;
import android.widget.ListView;
import android.widget.TextView;
import android.widget.Toast;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;

public class PatientListActivity extends AppCompatActivity {

    /* Member variables */
    final private int REQUEST_INTERNET = 123;
    final private String TAG = "PatientListActivity";

    // URL for the test
    final private String strURLTest = "https://patient-data-management.herokuapp.com/patients";

    // Text view for the test
    TextView textViewTest;
    EditText textEditField;

    ListView listViewPatient;
    InfoAdapterPatient infoAdapterPatient;
    //List listPatient = new ArrayList<String>();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_patient_list);

        // Get Views
        textViewTest = (TextView) findViewById(R.id.textViewTitle);
        //textEditField = (EditText) findViewById(R.id.editTextField);
        listViewPatient = findViewById(R.id.listViewPatient);

        infoAdapterPatient = new InfoAdapterPatient(this,R.layout.row_patient);
        listViewPatient.setAdapter(infoAdapterPatient);


        // Check Permissions
        if (ContextCompat.checkSelfPermission(this,
                Manifest.permission.INTERNET) != PackageManager.PERMISSION_GRANTED) {

            ActivityCompat.requestPermissions(this,
                    new String[]{Manifest.permission.INTERNET}, REQUEST_INTERNET);

        } else{
            // Set service URL for patients
            Patient.setUrlService(strURLTest);
            //call this asynchronously
            new GetPatientsTask().execute(strURLTest);
        }
    }



    // Get Patients
    private class GetPatientsTask extends AsyncTask<String, Void, String> {
        protected String doInBackground(String... urls) {
            return Patient.getPatients();
        }
        @Override
        protected void onPostExecute(String result) {

            //textViewTest.setText(result);
            //Toast.makeText(getBaseContext(), result, Toast.LENGTH_LONG).show();

            try{
                JSONObject jsonObject;
                JSONArray jsonArray = new JSONArray(result);

                int count = 0;
                String firstName ,lastName;

                // Create new adapter
                infoAdapterPatient = new InfoAdapterPatient(PatientListActivity.this, R.layout.row_patient);

                while (count < jsonArray.length()){
                    jsonObject = jsonArray.getJSONObject(count);
                    count++;
                    //d = jsonObject.getString("name");
                    firstName = jsonObject.getString("first_name");
                    lastName = jsonObject.getString("last_name");
                    Patient infoData = new Patient(firstName, lastName);

                    infoData.setId(jsonObject.getString("_id"));
                    try {
                        infoData.setAddress(jsonObject.getString("address"));
                    } catch (JSONException e) {}
                    try {
                        infoData.setSex(jsonObject.getString("sex"));
                    } catch (JSONException e) {}
                    try {
                        infoData.setDate_of_birth(jsonObject.getString("date_of_birth"));
                    } catch (JSONException e) {}
                    try {
                        infoData.setDepartment(jsonObject.getString("department"));
                    } catch (JSONException e) {}
                    try {
                        infoData.setDoctor(jsonObject.getString("doctor"));
                    } catch (JSONException e) {}

                    // Add data to the adapter
                    infoAdapterPatient.add(infoData);
                }


            } catch (JSONException e) {
                Log.d(TAG, e.getLocalizedMessage());
                e.printStackTrace();
            }

            // Set adapter
            listViewPatient.setAdapter(infoAdapterPatient);
        }
    }



    // Post Patients
    private class PostPatientTask extends AsyncTask<String, Void, String> {
        protected String doInBackground(String... urls) {

            JSONObject jsonObject = new JSONObject();
            try {
                jsonObject.put("first_name", "Huen_post");
                jsonObject.put("last_name", "Oh_post");
            } catch (JSONException e) {
                Log.d(TAG, e.getLocalizedMessage());
            }

            //String result = Patient.postPatient(jsonObject);
            return Patient.postPatient(jsonObject);

        }
        @Override
        protected void onPostExecute(String result) {
            Toast.makeText(PatientListActivity.this, result, Toast.LENGTH_LONG).show();
        }
    }



    // Get Patients
    private class GetPatientByIdTask extends AsyncTask<String, Void, String> {
        protected String doInBackground(String... ids) { return Patient.getPatientById(ids[0]); }
        @Override
        protected void onPostExecute(String result) {
            Toast.makeText(PatientListActivity.this, result, Toast.LENGTH_LONG).show();
        }
    }


    // Put Patients
    private class PutPatientByIdTask extends AsyncTask<String, Void, String> {
        protected String doInBackground(String... ids) {

            JSONObject jsonObject = new JSONObject();
            try {
                jsonObject.put("first_name", "Huen");
                jsonObject.put("last_name", "Oh");
            } catch (JSONException e) {
                Log.d(TAG, e.getLocalizedMessage());
            }

            return Patient.putPatientById(ids[0], jsonObject);

        }
        @Override
        protected void onPostExecute(String result) {
            Toast.makeText(PatientListActivity.this, result, Toast.LENGTH_LONG).show();
        }
    }


    // Delete Patients
    private class DeletePatientByIdTask extends AsyncTask<String, Void, String> {
        protected String doInBackground(String... ids) {
            return Patient.deletePatientById(ids[0]);
        }
        @Override
        protected void onPostExecute(String result) {
            Toast.makeText(PatientListActivity.this, result, Toast.LENGTH_LONG).show();
        }
    }




    // Get Records
    private class GetRecordsByPatientIdTask extends AsyncTask<String, Void, String> {
        protected String doInBackground(String... ids) { return Patient.getRecordsByPatientId(ids[0]); }
        @Override
        protected void onPostExecute(String result) {
            Toast.makeText(PatientListActivity.this, result, Toast.LENGTH_LONG).show();
        }
    }

    // Post a record
    private class PostRecordTask extends AsyncTask<String, Void, String> {
        protected String doInBackground(String... ids) {

            JSONObject jsonObject = new JSONObject();
            try {
                jsonObject.put("patient_id", ids[0]);
                jsonObject.put("nurse_name", "Nurse_post");
                jsonObject.put("date", "20190820");
                jsonObject.put("time", "1800");
                jsonObject.put("type", "Blood Pressure");
                jsonObject.put("value", "100");
            } catch (JSONException e) {
                Log.d(TAG, e.getLocalizedMessage());
            }

            //String result = Patient.postPatient(jsonObject);
            return Patient.postRecordByPatientId(ids[0], jsonObject);

        }
        @Override
        protected void onPostExecute(String result) {
            Toast.makeText(PatientListActivity.this, result, Toast.LENGTH_LONG).show();
        }
    }


    public void onClickGetPatients(View view){
        new GetPatientsTask().execute(strURLTest);
    }

    public void onClickPostPatient(View view){
        //new PostPatientTask().execute(strURLTest);
        new PostRecordTask().execute(textEditField.getText().toString());
    }


    public void onClickGetPatientById(View view){
        //new GetPatientByIdTask().execute(textEditField.getText().toString());
        new GetRecordsByPatientIdTask().execute(textEditField.getText().toString());
    }

    public void onClickPutPatientById(View view){
        new PutPatientByIdTask().execute(textEditField.getText().toString());
    }

    public void onClickDeletePatientById(View view){
        new DeletePatientByIdTask().execute(textEditField.getText().toString());
    }
}
