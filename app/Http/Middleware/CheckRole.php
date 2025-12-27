<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        if (!auth()->check()) {
            return redirect()->route('login');
        }

        $user = auth()->user();

        // Admin a accès à tout
        if ($user->role === 'admin') {
            return $next($request);
        }

        // Vérifier si l'utilisateur a un des rôles requis
        if (!in_array($user->role, $roles)) {
            abort(403, 'Accès non autorisé');
        }

        return $next($request);
    }
}
