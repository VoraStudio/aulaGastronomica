<?php
ob_start();
session_start();

// Carreguem dependències per llegir .env
require_once dirname(__DIR__) . '/vendor/autoload.php';

if (file_exists(dirname(__DIR__) . '/.env')) {
    $dotenv = Dotenv\Dotenv::createImmutable(dirname(__DIR__));
    $dotenv->load();
}

error_reporting(0);
header('Content-Type: application/json');

$csrf_secret = $_ENV['CSRF_TOKEN_SECRET'] ?? '';
if (strlen($csrf_secret) < 32) {
    echo json_encode(['error' => 'CSRF secret missing or too short.']);
    exit;
}

// Generem el token de seguretat del dia
$csrf_token = hash_hmac('sha256', date('Y-m-d'), $csrf_secret);

// També podem incloure la clau pública de reCAPTCHA per a que el JS la pugui carregar dinàmicament
$recaptcha_site_key = $_ENV['RECAPTCHA_SITE_KEY'] ?? '';

echo json_encode([
    'csrf_token' => $csrf_token,
    'recaptcha_site_key' => $recaptcha_site_key
]);
