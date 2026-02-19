<?php

require_once __DIR__ . '/../includes/app.php';

use MVC\Router;

$router = new Router();





//Compureba y valida las rutas, asigna las funciones del Controlador a cada ruta
$router->comprobarRutas();