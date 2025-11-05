<?php
// Simple image captcha generator (uses GD). Stores code in session under 'simple_captcha'.
session_start();

// Config
$width = 160;
$height = 50;
$length = 5;
$chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // avoid confusing chars

$code = '';
for ($i = 0; $i < $length; $i++) {
    $code .= $chars[rand(0, strlen($chars) - 1)];
}

// Store lowercase for case-insensitive comparison
$_SESSION['simple_captcha'] = strtolower($code);

// Create image
$im = imagecreatetruecolor($width, $height);
$bg = imagecolorallocate($im, 255, 255, 255);
$textcolor = imagecolorallocate($im, 0, 0, 0);
$noise_color = imagecolorallocate($im, 100, 120, 180);

imagefilledrectangle($im, 0, 0, $width, $height, $bg);

// Add noise - lines
for ($i = 0; $i < 6; $i++) {
    imageline($im, rand(0, $width), rand(0, $height), rand(0, $width), rand(0, $height), $noise_color);
}

// Add noise - dots
for ($i = 0; $i < 100; $i++) {
    imagesetpixel($im, rand(0, $width), rand(0, $height), $noise_color);
}

// Write text - attempt to use a TTF font if available, else imagestring
$fontfile = __DIR__ . '/../assets/fonts/arial.ttf';
if (file_exists($fontfile)) {
    $fontSize = 20;
    $x = 10;
    for ($i = 0; $i < strlen($code); $i++) {
        $angle = rand(-20, 20);
        $char = $code[$i];
        $y = rand(28, 38);
        imagettftext($im, $fontSize, $angle, $x, $y, $textcolor, $fontfile, $char);
        $x += 26;
    }
} else {
    // fallback
    imagestring($im, 5, 30, 15, $code, $textcolor);
}

// Output
header('Content-Type: image/png');
imagepng($im);
imagedestroy($im);

// End
?>
