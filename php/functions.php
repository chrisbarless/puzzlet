<?php
add_action('wp_ajax_get_sold_hexes', 'tft_handle_get_sold_hexes');
add_action('wp_ajax_nopriv_get_sold_hexes', 'tft_handle_get_sold_hexes');
function get_sold_hexes() {
    global $wpdb;

    $pusselbit_key = 'Pusselbit Number';

    $response = $wpdb->get_results("SELECT * FROM {$wpdb->prefix}woocommerce_order_itemmeta WHERE meta_key=\"{$pusselbit_key}\"", OBJECT);

    function mapper($result) {
        $digit = explode(" ", $result->meta_value) [0];
        return (int)$digit;
    }

    $response = array_map("mapper", $response);

    return $response;

}
function tft_handle_get_sold_hexes() {
    $hexes = get_sold_hexes();
    wp_send_json(array("soldIds" => $hexes));
}

add_filter('allowed_http_origins', 'add_allowed_origins');
function add_allowed_origins($origins) {
    $origins[] = 'http://localhost:1234';
    return $origins;
}
