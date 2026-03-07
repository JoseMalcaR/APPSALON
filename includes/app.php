<?php 

require 'funciones.php';
require 'database.php';
require __DIR__ . '/../vendor/autoload.php';

// Cargar variables de entorno
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->load();

// Conectarnos a la base de datos
use Model\ActiveRecord;

$db = conectarDB();
ActiveRecord::setDB($db);