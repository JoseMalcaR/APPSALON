<?php 

namespace Controllers;

use Model\Servicio;
use Model\Cita;
use Model\CitaServicio;

class ApiController {
    public static function index() {
        $servicio = Servicio ::all();
        echo json_encode($servicio);
    }

    public static function guardar() {
        //Almacena la cita y devuelve el ID
        $cita = new Cita($_POST);
        $resultado = $cita->guardar();

        $id = $resultado['id'];

        //Almacena los Servicios con el ID de la cita
        $idServicios = explode(',', $_POST['servicios']);

        foreach($idServicios as $idServicio) {
            $args = [
                'citaId' => $id,
                'servicioId' => $idServicio
            ];
            $citaServicio = new CitaServicio($args);
            $citaServicio->guardar();
        }        
        //Restornamos una respuesta en JSON

        echo json_encode([
            'resultado' => $resultado
        ]);
    }
}