package com.example.patientdataapp;

import android.os.AsyncTask;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.EditText;
import android.widget.ListView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class RecordListActivity extends AppCompatActivity {

    /* Member variables */
    final private String TAG = "PatientListActivity";

    // URL for the test
    final private String strURLTest = "https://patient-data-management.herokuapp.com";

    // Views
    EditText editTextPatientId, editTextRecordId;
    ListView listViewRecord;

    // TODO : create this
    //InfoAdapterRecord infoAdapterRecord;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_record_list);

        // Get views
        editTextPatientId = (EditText) findViewById(R.id.editTextPatientId);
        editTextRecordId = (EditText) findViewById(R.id.editTextRecordId);
        listViewRecord = findViewById(R.id.listViewRecord);

        // TODO : create this
        //infoAdapterRecord = new InfoAdapterPatient(this,R.layout.row_patient);
        //listViewRecord.setAdapter(infoAdapterRecord);

        // Set service url
        Record.setUrlService(strURLTest);

        new GetRecordsTask().execute(strURLTest);
    }

    // Get Patients
    private class GetRecordsTask extends AsyncTask<String, Void, String> {
        protected String doInBackground(String... ids) { return Record.getRecords(ids[0]); }

        @Override
        protected void onPostExecute(String result) {

            //textViewTest.setText(result);
            Toast.makeText(RecordListActivity.this, result, Toast.LENGTH_LONG).show();

            try{
                JSONObject jsonObject;
                JSONArray jsonArray = new JSONArray(result);


                int count = 0;
                String id, nurseName ,date, time, type, value;
                //String title, description;

                // TODO : create this
                //infoAdapterRecord = new InfoAdapterPatient(RecordListActivity.this, R.layout.row_record);

                while (count < jsonArray.length()){
                    jsonObject = jsonArray.getJSONObject(count);
                    count++;

                    nurseName = jsonObject.getString("nurse_name");
                    date = jsonObject.getString("date");
                    time = jsonObject.getString("time");
                    type = jsonObject.getString("type");
                    value = jsonObject.getString("value");

                    // TODO : create this
                    //Record infoData = new InfoDataRecord(firstName, lastName);
                    //infoAdapterRecord.add(infoData);

                }

            } catch (JSONException e) {
                Log.d(TAG, e.getLocalizedMessage());
                e.printStackTrace();
            }

            // TODO : create this
            //listViewRecord.setAdapter(infoAdapterRecord);
        }
    }



    // Post Patients
    private class PostRecordTask extends AsyncTask<String, Void, String> {
        protected String doInBackground(String... ids) {

            JSONObject jsonObject = new JSONObject();
            try {
                jsonObject.put("nurse_name", "nancy_post");
                jsonObject.put("date", "20190820");
                jsonObject.put("time", "1300");
                jsonObject.put("type", "Blood Pressure");
                jsonObject.put("value", "100");
            } catch (JSONException e) {
                Log.d(TAG, e.getLocalizedMessage());
            }

            //String result = Patient.postPatient(jsonObject);
            return Record.postRecord(ids[0], jsonObject);

        }
        @Override
        protected void onPostExecute(String result) {
            Toast.makeText(RecordListActivity.this, result, Toast.LENGTH_LONG).show();
        }
    }



    // Get Patients
    private class GetRecordByIdTask extends AsyncTask<String, Void, String> {
        protected String doInBackground(String... ids) { return Record.getRecordById(ids[0]); }
        @Override
        protected void onPostExecute(String result) {
            Toast.makeText(RecordListActivity.this, result, Toast.LENGTH_LONG).show();
        }
    }


    // Put Patients
    private class PutRecordByIdTask extends AsyncTask<String, Void, String> {
        protected String doInBackground(String... ids) {

            JSONObject jsonObject = new JSONObject();
            try {
                jsonObject.put("nurse_name", "nancy_put");
                //jsonObject.put("date", "20190820");
                //jsonObject.put("time", "1300");
                //jsonObject.put("type", "Blood Pressure");
                //jsonObject.put("value", "100");
            } catch (JSONException e) {
                Log.d(TAG, e.getLocalizedMessage());
            }

            return Record.putRecordById(ids[0], jsonObject);

        }
        @Override
        protected void onPostExecute(String result) {
            Toast.makeText(RecordListActivity.this, result, Toast.LENGTH_LONG).show();
        }
    }


    // Delete Patients
    private class DeleteRecordByIdTask extends AsyncTask<String, Void, String> {
        protected String doInBackground(String... ids) {
            return Record.deleteRecordById(ids[0]);
        }
        @Override
        protected void onPostExecute(String result) {
            Toast.makeText(RecordListActivity.this, result, Toast.LENGTH_LONG).show();
        }
    }





    public void onClickGetRecords(View view){
        final String patientId = editTextPatientId.getText().toString();
        new RecordListActivity.GetRecordsTask().execute(patientId);
    }

    public void onClickPostRecord(View view){
        final String patientId = editTextPatientId.getText().toString();
        new RecordListActivity.PostRecordTask().execute(patientId);
    }


    public void onClickGetRecordById(View view){
        final String recordId = editTextRecordId.getText().toString();
        new RecordListActivity.GetRecordByIdTask().execute(recordId);
    }

    public void onClickPutRecordById(View view){
        final String recordId = editTextRecordId.getText().toString();
        new RecordListActivity.PutRecordByIdTask().execute(recordId);
    }

    public void onClickDeleteRecordById(View view){
        final String recordId = editTextRecordId.getText().toString();
        new RecordListActivity.DeleteRecordByIdTask().execute(recordId);
    }
}
