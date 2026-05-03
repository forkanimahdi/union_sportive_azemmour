<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <title>Composition du match</title>
    <style>
        @page { size: A4 portrait; margin: 12mm; }
        * { box-sizing: border-box; }
        body {
            margin: 0;
            font-family: DejaVu Sans, Helvetica, Arial, sans-serif;
            font-size: 10pt;
            color: #171717;
        }
        h1 { font-size: 14pt; margin: 0 0 4mm 0; color: #571123; }
        .meta { font-size: 9pt; color: #444; margin-bottom: 6mm; line-height: 1.45; }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 2mm;
        }
        th, td {
            border: 1px solid #333;
            padding: 6px 8px;
            text-align: left;
            vertical-align: top;
        }
        th {
            background: #f3f3f3;
            font-weight: bold;
            width: 65%;
        }
        th:last-child { width: 35%; }
        tr:nth-child(even) td { background: #fafafa; }
        .footer {
            margin-top: 8mm;
            font-size: 8pt;
            color: #666;
        }
        .empty { padding: 10mm; text-align: center; color: #666; font-style: italic; }
    </style>
</head>
<body>
    <h1>Joueuses retenues — composition</h1>
    <div class="meta">
        <strong>{{ $match->team?->name ?? 'Équipe' }}</strong>
        @if($match->opponentTeam)
            vs {{ $match->opponentTeam->name }}
        @elseif($match->opponent)
            vs {{ $match->opponent }}
        @endif
        <br>
        <strong>Date</strong> {{ $match->scheduled_at?->timezone(config('app.timezone'))->format('d/m/Y à H:i') ?? '—' }}
        &nbsp;|&nbsp; <strong>Lieu</strong> {{ $match->venue ?? '—' }}
        @if($match->competition)
            <br><strong>Compétition</strong> {{ $match->competition->name }}
        @endif
    </div>

    @if($players->isEmpty())
        <p class="empty">Aucune joueuse dans la composition.</p>
    @else
        <table>
            <thead>
                <tr>
                    <th>Nom</th>
                    <th>Statut</th>
                </tr>
            </thead>
            <tbody>
                @foreach($players as $row)
                    <tr>
                        <td>{{ $row['name'] }}</td>
                        <td>{{ $row['status'] }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @endif

    <div class="footer">Union Sportive Azemmour — document généré le {{ now()->timezone(config('app.timezone'))->format('d/m/Y H:i') }}</div>
</body>
</html>
