<?php
session_start();

if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['result'])) {
    $_SESSION['captcha_result'] = intval($_POST['result']);
    echo "OK";
} else {
    echo "Error";
}
?>