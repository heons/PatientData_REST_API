package com.example.patientdataapp;

import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

import javax.net.ssl.HttpsURLConnection;

public class Record {

    /* Static variables */
    private static String urlService;

    /* Member variables */
    String patient_id;
    String nurse_name;
    String date;
    String time;
    String type;
    String value;


    /* Constructors */
    public Record() {
    }
    public Record(String patient_id) {
        this.patient_id = patient_id;
    }
    public Record(String patient_id, String nurse_name, String date, String time, String type, String value) {
        this.patient_id = patient_id;
        this.nurse_name = nurse_name;
        this.date = date;
        this.time = time;
        this.type = type;
        this.value = value;
    }


    /* Getters */
    public String getPatient_id()   { return patient_id; }
    public String getNurse_name()   { return nurse_name; }
    public String getDate()         { return date; }
    public String getTime()         { return time; }
    public String getType()         { return type; }
    public String getValue()        { return value; }


    /* Setters */
    public void setPatient_id(String patient_id)    { this.patient_id = patient_id; }
    public void setNurse_name(String nurse_name)    { this.nurse_name = nurse_name; }
    public void setDate(String date)                { this.date = date; }
    public void setTime(String time)                { this.time = time; }
    public void setType(String type)                { this.type = type; }
    public void setValue(String value)              { this.value = value; }


    // Connect using HTTP
    // TODO : find way to make it general use in classes
    static private HttpURLConnection httpConnect(URL url, String method) throws Exception {
        HttpURLConnection conn = null;

        try {
            conn = (HttpURLConnection) url.openConnection();
            conn.setAllowUserInteraction(false);
            conn.setInstanceFollowRedirects(true);
            //conn.setReadTimeout(15000);
            conn.setRequestProperty("Content-Type", "application/json");
            conn.setRequestProperty("Accept","application/json");
            //conn.setConnectTimeout(15000);
            conn.setRequestMethod(method);
            conn.connect();

        } catch (Exception e) {
            e.printStackTrace();
        }

        return conn;
    }

    // Get the response of HTTP connection
    // TODO : find way to make it general use in classes
    static private String httpGetResponse(HttpURLConnection conn, int okResponse) throws Exception {
        // Get response
        String response = "";
        try {
            int responseCode = conn.getResponseCode();
            if (okResponse == responseCode) {
                String line;
                BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream()));
                StringBuilder stringBuilder = new StringBuilder();
                while ((line = br.readLine()) != null) {
                    stringBuilder.append(line);
                }
                br.close();
                response = stringBuilder.toString().trim();
            } else {}

        } catch (Exception e) {
            e.printStackTrace();
        }

        return response;
    }


    // Set url for web service
    static public void setUrlService(String urlService) {
        Record.urlService = urlService;
    }


    // GET all records of a patient
    static public String getRecords(String patientId) {

        URL url;
        String response = "";

        try {
            // Connect
            url = new URL(Record.urlService + "/patients/" + patientId + "/records");
            HttpURLConnection conn = Record.httpConnect(url, "GET");

            // Get response
            response = Record.httpGetResponse(conn, HttpsURLConnection.HTTP_OK);

            // Disconnect
            conn.disconnect();

        } catch (Exception e) {
            e.printStackTrace();
        }

        return response;
    }


    // POST a record of a patient
    static public String postRecord(String patientId, JSONObject jsonObject) {
        URL url;
        String response = "";

        try {
            // Connect
            url = new URL(Record.urlService + "/patients/" + patientId + "/records");
            HttpURLConnection conn = Record.httpConnect(url, "POST");

            // Write data
            DataOutputStream os = new DataOutputStream(conn.getOutputStream());
            //os.writeBytes(URLEncoder.encode(jsonObject.toString(), "UTF-8"));
            //String strTmp = URLEncoder.encode(jsonObject.toString(), "UTF-8");
            os.writeBytes(jsonObject.toString());
            os.flush();
            os.close();

            // Get response
            response = Record.httpGetResponse(conn, HttpsURLConnection.HTTP_CREATED);

            // Disconnect
            conn.disconnect();

        } catch (Exception e) {
            e.printStackTrace();
        }

        return response;
    }


    // Get a patient by id
    static public String getRecordById(String recordId) {
        URL url;
        String response = "";

        try {
            // Connect
            url = new URL(Record.urlService + "/records/" + recordId);
            HttpURLConnection conn = Record.httpConnect(url, "GET");

            // Get response
            response = Record.httpGetResponse(conn, HttpsURLConnection.HTTP_OK);

            // Disconnect
            conn.disconnect();

        } catch (Exception e) {
            e.printStackTrace();
        }

        return response;
    }


    // PUT a record by id
    static public String putRecordById(String recordId, JSONObject jsonObject) {
        URL url;
        String response = "";

        try {
            // Connect
            url = new URL(Record.urlService + "/records/" + recordId);
            HttpURLConnection conn = Record.httpConnect(url, "PUT");

            // Write data
            DataOutputStream os = new DataOutputStream(conn.getOutputStream());
            //os.writeBytes(URLEncoder.encode(jsonObject.toString(), "UTF-8"));
            //String strTmp = URLEncoder.encode(jsonObject.toString(), "UTF-8");
            os.writeBytes(jsonObject.toString());
            os.flush();
            os.close();

            // Get response
            response = Record.httpGetResponse(conn, HttpsURLConnection.HTTP_CREATED);

            // Disconnect
            conn.disconnect();

        } catch (Exception e) {
            e.printStackTrace();
        }

        return response;
    }


    // Delete a record by id
    static public String deleteRecordById(String recordId) {
        URL url;
        String response = "";

        try {
            // Connect
            url = new URL(Record.urlService + "/records/" + recordId);
            HttpURLConnection conn = Record.httpConnect(url, "DELETE");

            // Get response
            response = Record.httpGetResponse(conn, HttpsURLConnection.HTTP_CREATED);

            // Disconnect
            conn.disconnect();

        } catch (Exception e) {
            e.printStackTrace();
        }

        return response;
    }

}
