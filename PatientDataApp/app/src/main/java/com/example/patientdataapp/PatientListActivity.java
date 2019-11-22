package com.example.patientdataapp;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import android.Manifest;
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
        textEditField = (EditText) findViewById(R.id.editTextField);
        listViewPatient = findViewById(R.id.listViewPatient);

        infoAdapterPatient = new InfoAdapterPatient(this,R.layout.row_patient);
        listViewPatient.setAdapter(infoAdapterPatient);


        // Check Permissions
        if (ContextCompat.checkSelfPermission(this,
                Manifest.permission.INTERNET) != PackageManager.PERMISSION_GRANTED) {

            ActivityCompat.requestPermissions(this,
                    new String[]{Manifest.permission.INTERNET}, REQUEST_INTERNET);

        } else{

            //HashMap<String, String> postDataParams = new HashMap<>();

            //postDataParams.put("title", "post title");
            //postDataParams.put("description", "post description");
            //performPostCall(strURLTest, postDataParams);


            //call this asynchronously
            //new PostPatientTask().execute(strURLTest);
            new GetPatientsTask().execute(strURLTest);
        }


        Patient.setUrlService(strURLTest);
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
                String id, firstName ,lastName;
                //String title, description;

                infoAdapterPatient = new InfoAdapterPatient(PatientListActivity.this, R.layout.row_patient);

                while (count < jsonArray.length()){
                    jsonObject = jsonArray.getJSONObject(count);
                    //d = jsonObject.getString("name");
                    firstName = jsonObject.getString("first_name");
                    lastName = jsonObject.getString("last_name");
                    //title = jsonObject.getString("first_name");
                    //description = jsonObject.getString("description");


                    InfoDataPatient infoData = new InfoDataPatient(firstName, lastName);
                    infoAdapterPatient.add(infoData);

                    count++;
                }
                listViewPatient.setAdapter(infoAdapterPatient);

            } catch (JSONException e) {
                Log.d(TAG, e.getLocalizedMessage());
                e.printStackTrace();
            }

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
        protected String doInBackground(String... ids) {
            return Patient.getPatientById(ids[0]);
        }
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



    public void onClickGetPatients(View view){
        new GetPatientsTask().execute(strURLTest);
    }

    public void onClickPostPatient(View view){ new PostPatientTask().execute(strURLTest); }


    public void onClickGetPatientById(View view){
        new GetPatientByIdTask().execute(textEditField.getText().toString());
    }

    public void onClickPutPatientById(View view){
        new PutPatientByIdTask().execute(textEditField.getText().toString());
    }

    public void onClickDeletePatientById(View view){
        new DeletePatientByIdTask().execute(textEditField.getText().toString());
    }
}
