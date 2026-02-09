<?php
// Force the server to show the real error message
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *"); 
header("Content-Type: application/json");

$host = 'sql312.infinityfree.com';
$db   = 'if0_41111895_analytics_db';
$user = 'if0_41111895';
$pass = 'x0Jw7gqFlCIJ5I'; 

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => $conn->connect_error]));
}

// If it reaches here, the connection is successful
echo json_encode(["status" => "success", "message" => "Connected to Database!"]);
?>