#include "ApiConnection.h"
#include "DataDispatcher.h"
#include "Dht22Sensor.h"
#include "SensorManager.h"
#include "SoilMoistureSensor.h"
#include "UltrasonicSensor.h"
#include <Arduino.h>

#ifdef USE_MOCK_SENSORS
#include "MockSensorAdapter.h"
#else
#include "Dht22Sensor.h"
#include "SoilMoistureSensor.h"
#include "UltrasonicSensor.h"
#endif

// Configuration constants

const char* WIFI_SSID = "edge 40 neo_4695";
const char* WIFI_PASSWORD = "emilio33";

// IMPORTANT: Use your computer's local IP address instead of localhost if testing locally
const char* API_URL = "http://192.168.0.19:3001/metrics/ESP32-INV-01";

// Global instances
SensorManager sensorManager;

// Global pointers for the sensors so we can access them in the loop for testing
Sensor* soilSensor;
Sensor* tempSensor;
Sensor* airHumiditySensor;
Sensor* waterLevelSensor;
ApiConnection* apiConnection;
DataDispatcher* dataDispatcher;

void setup()
{
    // Initialize serial communication for debugging
    Serial.begin(115200);
    delay(1000); // Give the Serial monitor a second to connect
    Serial.println("Initializing IoT Greenhouse System...");

    // Initialize Network Component
    apiConnection = new ApiConnection(WIFI_SSID, WIFI_PASSWORD, API_URL);
    apiConnection->connectWiFi();

#ifdef USE_MOCK_SENSORS
    Serial.println("MODO SIMULACIÓN: Cargando adaptadores matemáticos...");
    sensorManager.addSensor(new MockTemperatureAdapter());
    sensorManager.addSensor(new MockHumidityAdapter());
#else
    // Initialize Sensors (Adjust pins as needed)
    sensorManager.addSensor(new SoilMoistureSensor(34));
    sensorManager.addSensor(new Dht22Sensor(4, true));
    sensorManager.addSensor(new Dht22Sensor(4, false));
    sensorManager.addSensor(new UltrasonicSensor(5, 18));
#endif

    // Initialize the Observer and wire it to the Subject
    dataDispatcher = new DataDispatcher(&sensorManager, apiConnection);
    sensorManager.attachObserver(dataDispatcher);

    Serial.println("System fully initialized.");
}

void loop()
{
    Serial.println("\n--- Taking New Measurements ---");

    // 1. The Subject (Manager) commands all sensors to read their hardware
    // This single line replaces all the spaghetti code of reading pins manually
    sensorManager.readAll();

    // 2. Temporary Debugging: Print results to Serial Monitor
    // Once the DataDispatcher is implemented, this block won't be needed in the main loop

    // Serial.print("Type: ");
    // Serial.print(soilSensor->getSensorType());
    // Serial.print(" | Value: ");
    // Serial.println(soilSensor->getValue());

    // Serial.print("Type: ");
    // Serial.print(tempSensor->getSensorType());
    // Serial.print(" | Value: ");
    // Serial.println(tempSensor->getValue());

    // Serial.print("Type: ");
    // Serial.print(airHumiditySensor->getSensorType());
    // Serial.print(" | Value: ");
    // Serial.println(airHumiditySensor->getValue());

    // Serial.print("Type: ");
    // Serial.print(waterLevelSensor->getSensorType());
    // Serial.print(" | Value: ");
    // Serial.println(waterLevelSensor->getValue());

    // Wait 5 seconds before the next reading cycle
    delay(5000);
}