<?php

function debuguear($variable) : string {
    echo "<pre>";
    var_dump($variable);
    echo "</pre>";
    exit;
}

// Escapa / Sanitizar el HTML
function s(?string $html) : string {
    $s = htmlspecialchars($html ?? '', ENT_QUOTES, 'UTF-8');
    return $s;
}