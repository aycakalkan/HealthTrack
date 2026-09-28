namespace backend.Models;

public class Measurement
{
    public int Id { get; set; }

    public string PatientName { get; set; } = string.Empty;

    public int SystolicBloodPressure { get; set; }

    public int DiastolicBloodPressure { get; set; }

    public int HeartRate { get; set; }

    public int BloodGlucose { get; set; }

    public double Weight { get; set; }

    public DateTime MeasuredAt { get; set; }
}