<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include 'config.php';

if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed"]));
}

// Group visits by page URL
$sql = "SELECT page_url, COUNT(*) as count FROM visits GROUP BY page_url ORDER BY count DESC";
$result = $conn->query($sql);

$labels = [];
$data = [];

while($row = $result->fetch_assoc()) {
    // Clean up the URL for the label (e.g., remove http://localhost/)
    $cleanLabel = str_replace('http://localhost/smart-analytics/tracker/', '', $row['page_url']);
    $labels[] = $cleanLabel ? $cleanLabel : 'Home';
    $data[] = (int)$row['count'];
}

echo json_encode([
    'labels' => $labels,
    'datasets' => [[
        'label' => 'Total Visits',
        'data' => $data,
        'backgroundColor' => [
            '#4fc3f7', '#ffb74d', '#81c784', '#ba68c8', '#ef5350'
        ],
        'borderRadius' => 8,
        'barThickness' => 40
    ]]
]);
?>