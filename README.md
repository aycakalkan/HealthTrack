# HealthTrack

HealthTrack is a remote patient monitoring prototype that I developed as a side project focused on a digital health use case.

The main idea was to simulate how health data can be transferred from an IoT device to a backend API and displayed on a monitoring dashboard. I used Python to simulate the device, ASP.NET Core for the REST API, and React with TypeScript for the frontend.

This project is a software prototype and is not intended for medical diagnosis or clinical use.

## System Architecture

HealthTrack consists of three main components: an IoT device simulator, a REST API, and a web-based monitoring dashboard.

The Python simulator generates health measurements and sends them to the ASP.NET Core API as JSON data. The React dashboard periodically retrieves the measurements from the API and updates the interface automatically.

```
Python IoT Simulator
        |
        | POST /api/measurements
        |
        v
ASP.NET Core REST API
        |
        | GET /api/measurements
        |
        v
React + TypeScript Dashboard
```

## Features

- Simulated IoT health device
- REST API for sending and retrieving measurements
- Live dashboard updates
- Blood pressure trend visualization
- Recent measurement history
- Monitoring alerts
- Device and API status information
- Responsive dashboard design

The current prototype monitors systolic and diastolic blood pressure, heart rate, blood glucose, and weight.

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Recharts
- CSS

### Backend

- ASP.NET Core
- C#

### IoT Simulation

- Python

### Development Tools

- Git
- GitHub
- Visual Studio Code

## Project Structure

```
HealthTrack/
|
|-- backend/
|   |-- Models/
|   |   `-- Measurement.cs
|   `-- Program.cs
|
|-- frontend/
|   |-- public/
|   `-- src/
|       |-- App.tsx
|       |-- App.css
|       |-- index.css
|       `-- main.tsx
|
|-- simulator/
|   `-- device_simulator.py
|
|-- .gitignore
`-- README.md
```

## API Endpoints

The backend currently provides two main endpoints.

### Get Measurements

```http
GET /api/measurements
```

Returns the measurements currently available to the dashboard.

### Send Measurement

```http
POST /api/measurements
```

Receives a new measurement from the IoT simulator.

An example measurement:

```json
{
  "patientName": "Demo Patient",
  "systolicBloodPressure": 128,
  "diastolicBloodPressure": 82,
  "heartRate": 74,
  "bloodGlucose": 105,
  "weight": 67.4
}
```

## Real-Time Monitoring

The dashboard periodically sends a request to the API to retrieve the latest measurements.

This allows newly generated measurements to appear on the dashboard without manually refreshing the page. The latest values are displayed in the metric cards, while previous measurements are used for the trend chart and measurement history.

## Monitoring Alerts

I added a basic alert mechanism to demonstrate how measurements outside configured ranges can be highlighted on a monitoring dashboard.

The current prototype uses the following demo thresholds:

```
Systolic blood pressure >= 140
Diastolic blood pressure >= 90
Heart rate > 100
Heart rate < 60
```

These thresholds are used only to demonstrate the behavior of the application and should not be interpreted as clinical rules.

## Running the Project

### Requirements

The following tools are required:

- .NET SDK
- Node.js and npm
- Python
- Git


### Start the Backend

```bash
cd backend
dotnet run
```

The API runs locally at:

```
http://localhost:5084
```

Measurements can be retrieved from:

```
http://localhost:5084/api/measurements
```

### Start the Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The dashboard runs locally at:

```
http://localhost:5173
```

### Start the IoT Simulator

Open another terminal:

```bash
cd simulator
python device_simulator.py
```

On Windows, if the `python` command is not available:

```bash
py device_simulator.py
```

The simulator generates new measurements periodically and sends them to the REST API.

## Current Prototype Limitations

Measurements are currently stored in memory, which means they are reset when the backend application restarts.

The current version also uses a single simulated patient and does not include authentication, persistent database storage, or a physical IoT device.

These were kept outside the initial scope so I could focus on building and testing the complete data flow between the simulator, API, and frontend.

## Future Improvements

I would like to extend the project with:

- PostgreSQL integration for persistent data storage
- Multiple patient support
- Authentication and role-based authorization
- Physical IoT device integration
- AWS IoT Core integration
- Historical data analysis
- Notification system
- Cloud deployment

For a real healthcare environment, additional security, privacy, validation, and healthcare data requirements would also need to be considered.


