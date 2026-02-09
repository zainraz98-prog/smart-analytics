<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// In a real server, you'd use shell_exec('python3 ../processor/analysis.py');
// For this demo, we will simulate a 1.5-second processing delay
sleep(1.5); 

echo json_encode([
    "status" => "success",
    "message" => "Python analysis completed.",
    "timestamp" => date('H:i:s'),
    "stats" => [
        "peak_time" => "11:00 AM - 12:00 PM",
        "bounce_rate" => "22.1%",
        "top_browser" => "Chrome 121.x"
    ]
]);
?>