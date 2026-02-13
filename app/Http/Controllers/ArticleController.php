<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ArticleController extends Controller
{
    public function show(Article $article)
    {
        $article->increment('views');
        $article->load('user:id,name');

        $recommended = Article::with('user:id,name')
            ->where('id', '!=', $article->id)
            ->latest()
            ->limit(4)
            ->get()
            ->map(fn ($a) => [
                'id' => $a->id,
                'title' => $a->title,
                'image' => $a->image,
                'author' => $a->user?->name ?? '–',
                'views' => $a->views,
                'created_at' => $a->created_at?->toISOString(),
            ]);

        return Inertia::render('articles/show', [
            'article' => [
                'id' => $article->id,
                'title' => $article->title,
                'image' => $article->image,
                'body' => $article->body,
                'views' => $article->views,
                'created_at' => $article->created_at?->toISOString(),
                'author' => $article->user?->name ?? '–',
            ],
            'recommended' => $recommended->values()->all(),
        ]);
    }
}
