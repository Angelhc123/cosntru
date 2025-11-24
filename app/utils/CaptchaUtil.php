<?php
/**
 * Generador de captcha simple
 * Utilidad para generar imágenes de captcha
 */

require_once __DIR__ . '/../../config/session.php';

class CaptchaUtil {
    public static function generate() {
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

        // Write text
        $x = 10;
        for ($i = 0; $i < strlen($code); $i++) {
            $char = $code[$i];
            $x_pos = $x + ($i * 26);
            $y_pos = rand(20, 35);
            imagestring($im, 5, $x_pos, $y_pos, $char, $textcolor);
        }

        // Output
        header('Content-Type: image/png');
        header('Cache-Control: no-cache, no-store, must-revalidate');
        header('Pragma: no-cache');
        header('Expires: 0');
        
        imagepng($im);
        imagedestroy($im);
    }

    public static function validate($input) {
        if (empty($_SESSION['simple_captcha']) || strcasecmp($input, $_SESSION['simple_captcha']) !== 0) {
            return false;
        }
        // Consumir el captcha para que no pueda reutilizarse
        unset($_SESSION['simple_captcha']);
        return true;
    }
}

// Si se accede directamente, generar captcha
if (basename(__FILE__) == basename($_SERVER['SCRIPT_FILENAME'])) {
    CaptchaUtil::generate();
}
?>