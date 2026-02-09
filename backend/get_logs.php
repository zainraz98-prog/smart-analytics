<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
include 'config.php';

// Fetch the most recent 50 visits
$sql = "SELECT id, page_url, referrer, browser, created_at FROM visits ORDER BY created_at DESC LIMIT 50";
$result = $conn->query($sql);

$logs = [];
while($row = $result->fetch_assoc()) {
    // Clean URL for better display
    $row['page_url'] = str_replace('http://localhost/smart-analytics/tracker/', '', $row['page_url']);
    $logs[] = $row;
}

echo json_encode($logs);
?>