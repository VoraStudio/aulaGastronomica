<?php
ob_start();
session_start();

// Carreguem l'autoload de Composer
require_once dirname(__DIR__) . '/vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use Dotenv\Dotenv;

// Carreguem les variables d'entorn
$dotenv = Dotenv::createImmutable(dirname(__DIR__));
$dotenv->load();

error_reporting(0);
header('Content-Type: application/json');

/* ==========================================================================
   CONFIGURACIÓ I SEGURETAT (Aula Gastronòmica)
   ========================================================================== */

// Saltar reCAPTCHA en localhost per poder provar el formulari
$is_localhost = in_array($_SERVER['HTTP_HOST'] ?? '', ['localhost', '127.0.0.1']);

if (!$is_localhost) {
    $recaptcha_secret = $_ENV['RECAPTCHA_SECRET'] ?? '';
    $recaptcha_response = $_POST['recaptcha_response'] ?? '';

    $url = 'https://www.google.com/recaptcha/api/siteverify';
    $data = [
        'secret' => $recaptcha_secret,
        'response' => $recaptcha_response
    ];

    // Verificació amb cURL (més robust que file_get_contents)
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
    $response = curl_exec($ch);

    if (curl_errno($ch)) {
        error_log("Aula SMTP cURL error: " . curl_error($ch));
        echo json_encode(['ok' => false, 'error' => 'Error de verificació de seguretat. Torna-ho a provar.']);
        curl_close($ch);
        exit;
    }
    curl_close($ch);

    $response_keys = json_decode($response, true);

    if (!$response_keys["success"]) {
        $error_msg = 'La verificació de seguretat ha fallat.';
        echo json_encode(['ok' => false, 'error' => $error_msg]);
        exit;
    }
}

// 1. RATE LIMITING (Sessió)
$temps_espera = 10;
if (isset($_SESSION['last_submit_time'])) {
    $temps_transcorregut = time() - $_SESSION['last_submit_time'];
    if ($temps_transcorregut < $temps_espera) {
        $restant = $temps_espera - $temps_transcorregut;
        echo json_encode(['ok' => false, 'error' => "Has d'esperar $restant segons abans d'enviar un altre missatge."]);
        exit;
    }
}

// 2. VALIDACIÓ CSRF (Stateless HMAC)
$csrf_secret = $_ENV['CSRF_TOKEN_SECRET'] ?? '';
if (strlen($csrf_secret) < 32) {
    error_log("Aula Gastronòmica CRITICAL: CSRF_TOKEN_SECRET is missing or too short");
    echo json_encode(['ok' => false, 'error' => 'Error de configuració de seguretat. Contacta amb l\'administrador.']);
    exit;
}
$token_rebut = $_POST['csrf_token'] ?? '';

// Calculem els tokens vàlids (avui i ahir per si el formulari es va carregar prop de mitjanit)
$token_avui = hash_hmac('sha256', date('Y-m-d'), $csrf_secret);
$token_ahir = hash_hmac('sha256', date('Y-m-d', strtotime("-1 day")), $csrf_secret);

if ($token_rebut !== $token_avui && $token_rebut !== $token_ahir) {
    echo json_encode(['ok' => false, 'error' => 'Validació de seguretat (CSRF) fallida. (Token invàlid o expirat)']);
    exit;
}

// 3. HONEYPOT
if (!empty($_POST['honeypot'])) {
    echo json_encode(['ok' => false, 'error' => 'Spam detectat.']);
    exit;
}

// 4. SANEJAMENT DE DADES
$nombre = htmlspecialchars(trim($_POST['name'] ?? 'Sense nom'));
$email = filter_var(trim($_POST['email'] ?? ''), FILTER_SANITIZE_EMAIL);
$telefono = htmlspecialchars(trim($_POST['phone'] ?? 'No facilitat'));
$asunto = htmlspecialchars(trim($_POST['subject'] ?? 'Sense assumpte'));
$mensaje = htmlspecialchars(trim($_POST['message'] ?? 'Sense missatge'));

// 5. VALIDACIÓ DE CAMPS CRÍTICS
if (empty($nombre) || !filter_var($email, FILTER_VALIDATE_EMAIL) || empty($mensaje)) {
    echo json_encode(['ok' => false, 'error' => 'Si us plau, omple tots els camps obligatoris correctament.']);
    exit;
}

// 6. MAIL-TRAP LOCAL vs ENVIAMENT REAL
$dev_send_real = !empty($_ENV['DEV_SEND_REAL']) && $_ENV['DEV_SEND_REAL'] === 'true';
if ($is_localhost && !$dev_send_real) {
    // --- Mode local: responem ok sense desar res ---
    $_SESSION['last_submit_time'] = time();
    echo json_encode(['ok' => true, 'message' => 'Missatge enviat correctament! (Mode local de proves)']);

} else {
    // --- Mode producció: enviament real amb PHPMailer ---
    $mail = new PHPMailer(true);

    try {
        // Configuració del servidor SMTP
        $mail->isSMTP();
        $mail->Host = $_ENV['SMTP_HOST'];
        $mail->SMTPAuth = true;
        $mail->Username = $_ENV['SMTP_USER'];
        $mail->Password = $_ENV['SMTP_PASS'];
        $mail->SMTPSecure = $_ENV['SMTP_ENCRYPTION'] === 'ssl' ? PHPMailer::ENCRYPTION_SMTPS : PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = $_ENV['SMTP_PORT'];
        $mail->CharSet = 'UTF-8';

        // Destinataris
        $mail->setFrom($_ENV['SMTP_USER'], 'Formulari Aula Gastronòmica');
        $mail->addAddress($_ENV['SMTP_USER']); // Es rep al mateix correu
        $mail->addReplyTo($email, $nombre);

        // Contingut
        $mail->isHTML(false);
        $mail->Subject = 'Nou missatge de contacte: ' . $asunto;

        $contenido = "Has rebut un nou missatge des del formulari de contacte de l'Aula Gastronòmica:\n\n";
        $contenido .= "Nom complet: $nombre\n";
        $contenido .= "Email: $email\n";
        $contenido .= "Telèfon: $telefono\n";
        $contenido .= "Assumpte: $asunto\n\n";
        $contenido .= "Missatge:\n$mensaje\n";

        $mail->Body = $contenido;
        $mail->send();

        $_SESSION['last_submit_time'] = time();
        echo json_encode(['ok' => true, 'message' => 'Missatge enviat correctament! Ens posarem en contacte amb tu molt aviat.']);

    } catch (Exception $e) {
        error_log("Aula Gastronòmica SMTP Error: {$mail->ErrorInfo}");
        echo json_encode(['ok' => false, 'error' => "El missatge no s'ha pogut enviar. Torna-ho a provar més tard."]);
    }
}
