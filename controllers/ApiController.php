<?php 

namespace Controllers;

use Model\Servicio;

class ApiController {
    public static function index() {
        $servicio = Servicio ::all();
        echo json_encode($servicio);
    }
}