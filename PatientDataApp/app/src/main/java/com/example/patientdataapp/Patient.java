package com.example.patientdataapp;

import android.util.Log;

import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;

import javax.net.ssl.HttpsURLConnection;

public class Patient {

    /* Static variables */
    private static String urlService;

    /* Member variables */
    String first_name;
    String last_name;
    String address;
    String sex;
    String date_of_birth;
    String department;
    String doctor;


    /* Constructors */
    public Patient() {
    }
    public Patient(String first_name, String last_name) {
        this.first_name = first_name;
        this.last_name = last_name;
    }
    public Patient(String first_name, String last_name, String address, String sex, String date_of_birth, String department, String doctor) {
        this.first_name = first_name;
        this.last_name = last_name;
        this.address = address;
        this.sex = sex;
        this.date_of_birth = date_of_birth;
        this.department = department;
        this.doctor = doctor;
    }


    /* Getters */
    public String getFirst_name()       { return first_name; }
    public String getLast_name()        { return last_name; }
    public String getAddress()          { return address; }
    public String getSex()              { return sex; }
    public String getDate_of_birth()    { return date_of_birth; }
    public String getDepartment()       { return department; }
    public String getDoctor()           { return doctor; }


    /* Setters */
    public void setFirst_name(String first_name)        { this.first_name = first_name; }
    public void setLast_name(String last_name)          { this.last_name = last_name; }
    public void setAddress(String address)              { this.address = address; }
    public void setSex(String sex)                      { this.sex = sex; }
    public void setDate_of_birth(String date_of_birth)  { this.date_of_birth = date_of_birth; }
    public void setDepartment(String department)        { this.department = department; }
    public void setDoctor(String doctor)                { this.doctor = doctor; }


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
        Patient.urlService = urlService;
    }


    // GET all patients
    static public String getPatients() {

        URL url;
        String response = "";

        try {
            // Connect
            url = new URL(Patient.urlService);
            HttpURLConnection conn = Patient.httpConnect(url, "GET");

            // Get response
            response = Patient.httpGetResponse(conn, HttpsURLConnection.HTTP_OK);

            // Disconnect
            conn.disconnect();

        } catch (Exception e) {
            e.printStackTrace();
        }

        return response;
    }

    // POST a patient by id
    static public String postPatient(JSONObject jsonObject) {
        URL url;
        String response = "";

        try {
            // Connect
            url = new URL(Patient.urlService);
            HttpURLConnection conn = Patient.httpConnect(url, "POST");

            // Write data
            DataOutputStream os = new DataOutputStream(conn.getOutputStream());
            //os.writeBytes(URLEncoder.encode(jsonObject.toString(), "UTF-8"));
            //String strTmp = URLEncoder.encode(jsonObject.toString(), "UTF-8");
            os.writeBytes(jsonObject.toString());
            os.flush();
            os.close();

            // Get response
            response = Patient.httpGetResponse(conn, HttpsURLConnection.HTTP_CREATED);

            // Disconnect
            conn.disconnect();

        } catch (Exception e) {
            e.printStackTrace();
        }

        return response;
    }


    // Get a patient by id
    static public String getPatientById(String id) {
        URL url;
        String response = "";

        try {
            // Connect
            url = new URL(Patient.urlService + "/" + id);
            HttpURLConnection conn = Patient.httpConnect(url, "GET");

            // Get response
            response = Patient.httpGetResponse(conn, HttpsURLConnection.HTTP_OK);

            // Disconnect
            conn.disconnect();

        } catch (Exception e) {
            e.printStackTrace();
        }

        return response;
    }


    // PUT a patient by id
    static public String putPatientById(String id, JSONObject jsonObject) {
        URL url;
        String response = "";

        try {
            // Connect
            url = new URL(Patient.urlService + "/" + id);
            HttpURLConnection conn = Patient.httpConnect(url, "PUT");

            // Write data
            DataOutputStream os = new DataOutputStream(conn.getOutputStream());
            //os.writeBytes(URLEncoder.encode(jsonObject.toString(), "UTF-8"));
            //String strTmp = URLEncoder.encode(jsonObject.toString(), "UTF-8");
            os.writeBytes(jsonObject.toString());
            os.flush();
            os.close();

            // Get response
            response = Patient.httpGetResponse(conn, HttpsURLConnection.HTTP_CREATED);

            // Disconnect
            conn.disconnect();

        } catch (Exception e) {
            e.printStackTrace();
        }

        return response;
    }


    // Delete a patient by id
    static public String deletePatientById(String id) {
        URL url;
        String response = "";

        try {
            // Connect
            url = new URL(Patient.urlService + "/" + id);
            HttpURLConnection conn = Patient.httpConnect(url, "DELETE");

            // Get response
            response = Patient.httpGetResponse(conn, HttpsURLConnection.HTTP_CREATED);

            // Disconnect
            conn.disconnect();

        } catch (Exception e) {
            e.printStackTrace();
        }

        return response;
    }





    // Get records by patient id
    static public String getRecordsByPatientId(String id) {
        URL url;
        String response = "";

        try {
            // Connect
            url = new URL(Patient.urlService + "/" + id + "/records");
            HttpURLConnection conn = Patient.httpConnect(url, "GET");

            // Get response
            response = Patient.httpGetResponse(conn, HttpsURLConnection.HTTP_OK);

            // Disconnect
            conn.disconnect();

        } catch (Exception e) {
            e.printStackTrace();
        }

        return response;
    }

    // Post a record of a patient id
    static public String postRecordByPatientId(String id, JSONObject jsonObject) {
        URL url;
        String response = "";

        try {
            // Connect
            url = new URL(Patient.urlService + "/" + id + "/records");
            HttpURLConnection conn = Patient.httpConnect(url, "POST");

            // Write data
            DataOutputStream os = new DataOutputStream(conn.getOutputStream());
            //os.writeBytes(URLEncoder.encode(jsonObject.toString(), "UTF-8"));
            //String strTmp = URLEncoder.encode(jsonObject.toString(), "UTF-8");
            os.writeBytes(jsonObject.toString());
            os.flush();
            os.close();

            // Get response
            response = Patient.httpGetResponse(conn, HttpsURLConnection.HTTP_CREATED);

            // Disconnect
            conn.disconnect();

        } catch (Exception e) {
            e.printStackTrace();
        }

        return response;
    }






}
