<?php

use App\Http\Controllers\ArticleController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\PartnersController;
use App\Http\Controllers\ShopController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', HomeController::class)->name('home');

Route::get('/articles/{article}', [ArticleController::class, 'show'])->name('articles.show');

Route::get('/about', function () {
    return Inertia::render('About/index');
})->name('about');

Route::get('/partenaires', [PartnersController::class, 'index'])->name('partners');

Route::get('/contact', function () {
    return Inertia::render('Contact/index');
})->name('contact');

Route::get('/shop', [ShopController::class, 'index'])->name('shop');
Route::get('/shop/{product}', [ShopController::class, 'show'])->name('shop.show');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/admin.php';
