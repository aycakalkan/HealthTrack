using backend.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();
builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        policy
            .WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();
app.UseCors("Frontend");

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();


var measurements = new List<Measurement>
{
    new Measurement
    {
        Id = 1,
        PatientName = "Demo Patient",
        SystolicBloodPressure = 128,
        DiastolicBloodPressure = 82,
        HeartRate = 74,
        BloodGlucose = 105,
        Weight = 67.4,
        MeasuredAt = DateTime.Now
    },

    new Measurement
    {
        Id = 2,
        PatientName = "Demo Patient",
        SystolicBloodPressure = 135,
        DiastolicBloodPressure = 85,
        HeartRate = 78,
        BloodGlucose = 110,
        Weight = 67.2,
        MeasuredAt = DateTime.Now.AddHours(-6)
    }
};


app.MapGet("/api/measurements", () =>
{
    return measurements;
});
app.MapPost("/api/measurements", (Measurement measurement) =>
{
    measurement.Id = measurements.Count + 1;

    if (measurement.MeasuredAt == default)
    {
        measurement.MeasuredAt = DateTime.Now;
    }

    measurements.Add(measurement);

    return Results.Created($"/api/measurements/{measurement.Id}", measurement);
});

app.Run();
