<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
include 'config.php';

$data = json_decode(file_get_contents('php://input'), true);

if ($data) {
    $name = $data['projectName'];
    $domain = $data['domain'];
    
    // Update the single settings row
    $stmt = $conn->prepare("UPDATE settings SET project_name = ?, tracking_domain = ? WHERE id = 1");
    $stmt->bind_param("ss", $name, $domain);
    
    if($stmt->execute()) {
        echo json_encode(["status" => "success"]);
    } else {
        echo json_encode(["status" => "error"]);
    }
}
?>