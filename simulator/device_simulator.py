import json
import random
import time
import urllib.request

API_URL = "http://localhost:5084/api/measurements"

while True:
    measurement = {
        "patientName": "Demo Patient",
        "systolicBloodPressure": random.randint(115, 145),
        "diastolicBloodPressure": random.randint(70, 95),
        "heartRate": random.randint(60, 100),
        "bloodGlucose": random.randint(80, 130),
        "weight": round(random.uniform(66.5, 68.0), 1)
    }

    data = json.dumps(measurement).encode("utf-8")

    request = urllib.request.Request(
        API_URL,
        data=data,
        headers={"Content-Type": "application/json"},
        method="POST"
    )

    try:
        with urllib.request.urlopen(request) as response:
            result = json.loads(response.read().decode("utf-8"))

            print(
                f"Measurement sent | "
                f"BP: {result['systolicBloodPressure']}/"
                f"{result['diastolicBloodPressure']} | "
                f"HR: {result['heartRate']} bpm | "
                f"Glucose: {result['bloodGlucose']} mg/dL"
            )

    except Exception as error:
        print(f"Error sending measurement: {error}")

    time.sleep(10)