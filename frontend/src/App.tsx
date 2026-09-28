import { useEffect, useState } from "react";
import "./App.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

type Measurement = {
  id: number;
  patientName: string;
  systolicBloodPressure: number;
  diastolicBloodPressure: number;
  heartRate: number;
  bloodGlucose: number;
  weight: number;
  measuredAt: string;
};

function App() {
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
   const fetchMeasurements = () => {
    fetch("http://localhost:5084/api/measurements")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch measurements");
        }

        return response.json();
      })
      .then((data) => {
        setMeasurements(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch measurements:", error);
        setLoading(false);
      });
  };

  fetchMeasurements();

  const interval = setInterval(fetchMeasurements, 5000);

  return () => clearInterval(interval);
  }, []);

  const latest = measurements[measurements.length - 1];
  const alerts = measurements.filter(
  (measurement) =>
    measurement.systolicBloodPressure >= 140 ||
    measurement.diastolicBloodPressure >= 90 ||
    measurement.heartRate > 100 ||
    measurement.heartRate < 60
);
  const chartData = measurements.slice(-10).map((measurement) => ({
  time: new Date(measurement.measuredAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  }),
  systolic: measurement.systolicBloodPressure,
  diastolic: measurement.diastolicBloodPressure,
}));

  if (loading) {
    return <div className="loading">Loading health data...</div>;
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div>
          <div className="brand">
            <div className="brand-icon">+</div>
            <div>
              <h2>HealthTrack</h2>
              <span>Digital Health</span>
            </div>
          </div>

          <nav>
            <button className="nav-item active">Dashboard</button>
            <button className="nav-item">Patients</button>
            <button className="nav-item">Measurements</button>
            <button className="nav-item">Alerts</button>
          </nav>
        </div>

        <div className="sidebar-footer">
          <span className="status-dot"></span>
          Monitoring System Online
        </div>
      </aside>

      <main className="main">
        <header className="header">
          <div>
            <p className="eyebrow">REMOTE PATIENT MONITORING</p>
            <h1>Patient Overview</h1>
            <p className="subtitle">
              Real-time health measurements from connected devices
            </p>
          </div>

          <div className="device-status">
            <span className="status-dot"></span>
            Device Connected
          </div>
        </header>

        {latest ? (
          <>
            <section className="patient">
              <div className="avatar">DP</div>

              <div>
                <p className="small-label">CURRENT PATIENT</p>
                <h2>{latest.patientName}</h2>
                <p>Remote monitoring patient</p>
              </div>

              <div className="patient-measurements">
                {measurements.length} measurements received
              </div>
            </section>

            <section className="cards">
              <MetricCard
                title="Blood Pressure"
                value={`${latest.systolicBloodPressure}/${latest.diastolicBloodPressure}`}
                unit="mmHg"
                status={
                  latest.systolicBloodPressure >= 140 ||
                  latest.diastolicBloodPressure >= 90
                    ? "Attention"
                    : "Within range"
                }
              />

              <MetricCard
                title="Heart Rate"
                value={latest.heartRate}
                unit="bpm"
                status={
                  latest.heartRate > 100 || latest.heartRate < 60
                    ? "Attention"
                    : "Within range"
                }
              />

              <MetricCard
                title="Blood Glucose"
                value={latest.bloodGlucose}
                unit="mg/dL"
                status="Latest reading"
              />

              <MetricCard
                title="Weight"
                value={latest.weight}
                unit="kg"
                status="Latest reading"
              />
            </section>
            <section className="panel chart-panel">
  <div className="panel-heading">
    <div>
      <p className="small-label">HEALTH TREND</p>
      <h2>Blood Pressure Trend</h2>
    </div>

    <span className="live-badge">LIVE DATA</span>
  </div>

  <div className="chart-container">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />

        <XAxis
          dataKey="time"
          tick={{ fontSize: 11 }}
        />

        <YAxis
          domain={["dataMin - 10", "dataMax + 10"]}
          tick={{ fontSize: 11 }}
        />

        <Tooltip />

        <Legend />

        <Line
          type="monotone"
          dataKey="systolic"
          name="Systolic"
          stroke="#16847f"
          strokeWidth={3}
          dot={{ r: 4 }}
        />

        <Line
          type="monotone"
          dataKey="diastolic"
          name="Diastolic"
          stroke="#63758a"
          strokeWidth={3}
          dot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
</section>
<section className="panel alerts-panel">
  <div className="panel-heading">
    <div>
      <p className="small-label">MONITORING ALERTS</p>
      <h2>Attention Required</h2>
    </div>

    <span className={alerts.length > 0 ? "alert-count active" : "alert-count"}>
      {alerts.length} alerts
    </span>
  </div>

  {alerts.length === 0 ? (
    <div className="no-alerts">
      <span className="check-icon">✓</span>

      <div>
        <strong>No active alerts</strong>
        <p>All monitored values are within the configured demo ranges.</p>
      </div>
    </div>
  ) : (
    <div className="alert-list">
      {[...alerts]
        .reverse()
        .slice(0, 3)
        .map((measurement) => (
          <div className="alert-item" key={measurement.id}>
            <div className="alert-icon">!</div>

            <div className="alert-details">
              <strong>Measurement outside configured range</strong>

              <p>
                BP {measurement.systolicBloodPressure}/
                {measurement.diastolicBloodPressure} mmHg
                {" · "}
                HR {measurement.heartRate} bpm
              </p>

              <span>
                {new Date(measurement.measuredAt).toLocaleString()}
              </span>
            </div>

            <span className="attention-badge">Attention</span>
          </div>
        ))}
    </div>
  )}

  <p className="medical-disclaimer">
    Prototype monitoring thresholds only. This system does not provide
    medical diagnosis or treatment recommendations.
  </p>
</section>

            <section className="content-grid">
              <div className="panel">
                <div className="panel-heading">
                  <div>
                    <p className="small-label">MONITORING</p>
                    <h2>Recent Measurements</h2>
                  </div>

                  <span className="live-badge">LIVE</span>
                </div>

                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>Time</th>
                        <th>Blood Pressure</th>
                        <th>Heart Rate</th>
                        <th>Glucose</th>
                        <th>Weight</th>
                      </tr>
                    </thead>

                    <tbody>
                      {[...measurements]
                        .reverse()
                        .slice(0, 6)
                        .map((measurement) => (
                          <tr key={measurement.id}>
                            <td>
                              {new Date(
                                measurement.measuredAt
                              ).toLocaleTimeString()}
                            </td>

                            <td>
                              <strong>
                                {measurement.systolicBloodPressure}/
                                {measurement.diastolicBloodPressure}
                              </strong>{" "}
                              mmHg
                            </td>

                            <td>{measurement.heartRate} bpm</td>

                            <td>{measurement.bloodGlucose} mg/dL</td>

                            <td>{measurement.weight} kg</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="panel monitoring-panel">
                <p className="small-label">SYSTEM</p>
                <h2>Monitoring Status</h2>

                <div className="monitoring-item">
                  <span className="monitor-icon">●</span>
                  <div>
                    <strong>IoT Device</strong>
                    <p>Connected</p>
                  </div>
                </div>

                <div className="monitoring-item">
                  <span className="monitor-icon">●</span>
                  <div>
                    <strong>REST API</strong>
                    <p>Operational</p>
                  </div>
                </div>

                <div className="monitoring-item">
                  <span className="monitor-icon">●</span>
                  <div>
                    <strong>Last Measurement</strong>
                    <p>
                      {new Date(latest.measuredAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>

                <div className="info-box">
                  <strong>Prototype System</strong>
                  <p>
                    Measurements are generated by a simulated IoT health
                    device and transmitted through the HealthTrack REST API.
                  </p>
                </div>
              </div>
            </section>
          </>
        ) : (
          <div className="empty-state">
            <h2>No measurements available</h2>
            <p>Start the IoT simulator to receive health data.</p>
          </div>
        )}
      </main>
    </div>
  );
}

type MetricCardProps = {
  title: string;
  value: string | number;
  unit: string;
  status: string;
};

function MetricCard({ title, value, unit, status }: MetricCardProps) {
  return (
    <div className="metric-card">
      <div className="metric-top">
        <span>{title}</span>
        <span className="metric-dot"></span>
      </div>

      <div className="metric-value">
        {value}
        <span>{unit}</span>
      </div>

      <div className="metric-status">{status}</div>
    </div>
  );
}

export default App;
