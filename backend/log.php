<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
include 'config.php';

$url = $_POST['url'] ?? '';
$ref = $_POST['referrer'] ?? 'Direct';
$agent = $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown';

if ($url) {
    $stmt = $conn->prepare("INSERT INTO visits (page_url, referrer, browser) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $url, $ref, $agent);
    $stmt->execute();
    echo json_encode(["status" => "success"]);
}
?>