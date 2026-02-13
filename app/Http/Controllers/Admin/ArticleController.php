<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class ArticleController extends Controller
{
    public function index(Request $request)
    {
        $query = Article::with('user:id,name')->latest();

        if ($request->filled('search')) {
            $term = '%' . $request->search . '%';
            $query->where('title', 'like', $term);
        }

        $articles = $query->paginate(12)->through(fn ($a) => [
            'id' => $a->id,
            'title' => $a->title,
            'image' => $a->image,
            'views' => $a->views,
            'body' => $a->body,
            'created_at' => $a->created_at?->toISOString(),
            'user' => $a->user ? ['id' => $a->user->id, 'name' => $a->user->name] : null,
        ]);

        return Inertia::render('admin/articles/index', ['articles' => $articles]);
    }

    public function create()
    {
        return Inertia::render('admin/articles/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'body' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:4096',
        ]);

        $validated['user_id'] = $request->user()->id;
        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('articles', 'public');
        }

        Article::create($validated);

        return redirect()->route('admin.articles.index')->with('success', 'Article créé.');
    }

    public function edit(Article $article)
    {
        $article->load('user:id,name');
        return Inertia::render('admin/articles/edit', [
            'article' => [
                'id' => $article->id,
                'title' => $article->title,
                'image' => $article->image,
                'views' => $article->views,
                'body' => $article->body,
                'created_at' => $article->created_at?->toISOString(),
                'user' => $article->user ? ['id' => $article->user->id, 'name' => $article->user->name] : null,
            ],
        ]);
    }

    public function update(Request $request, Article $article)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'body' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:4096',
        ]);

        if ($request->hasFile('image')) {
            if ($article->image) {
                Storage::disk('public')->delete($article->image);
            }
            $validated['image'] = $request->file('image')->store('articles', 'public');
        }

        $article->update($validated);

        return redirect()->route('admin.articles.index')->with('success', 'Article mis à jour.');
    }

    public function destroy(Article $article)
    {
        if ($article->image) {
            Storage::disk('public')->delete($article->image);
        }
        $article->delete();
        return redirect()->route('admin.articles.index')->with('success', 'Article supprimé.');
    }
}
