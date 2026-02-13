<?php

namespace Database\Seeders;

use App\Models\ProductCategory;
use Illuminate\Database\Seeder;

class ProductCategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = ['Maillots', 'Accessoires', 'Équipement', 'Autres'];
        foreach ($categories as $name) {
            ProductCategory::firstOrCreate(['name' => $name]);
        }
    }
}
