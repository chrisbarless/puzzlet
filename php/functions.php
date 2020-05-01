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
    /* $name	= isset($_POST['name'])?trim($_POST['name']):""; */
    $hexes = get_sold_hexes();
    wp_send_json(array("soldIds" => $hexes));
}

