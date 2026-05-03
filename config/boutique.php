<?php

return [

    /*
    | Admin and shop treat stock at or below this number as "low" (warning).
    */
    'low_stock_threshold' => (int) env('BOUTIQUE_LOW_STOCK_THRESHOLD', 5),

    /*
    | Remise sur le sous-total articles (hors livraison) lorsque la quantité
    | est >= ce seuil. Par défaut 5 = « au-delà de 4 articles » (strictement plus de 4).
    | Pour une remise dès 4 articles, définir BOUTIQUE_VOLUME_DISCOUNT_MIN_QTY=4.
    */
    'volume_discount_min_quantity' => (int) env('BOUTIQUE_VOLUME_DISCOUNT_MIN_QTY', 5),

    'volume_discount_amount' => (float) env('BOUTIQUE_VOLUME_DISCOUNT_AMOUNT', 250),

];
