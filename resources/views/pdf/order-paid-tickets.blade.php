<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <title>Bordereau commande payée</title>
    <style>
        @page { size: A4 portrait; margin: 5mm; }
        * { box-sizing: border-box; }
        html, body { margin: 0; padding: 0; height: 100%; }
        body {
            font-family: DejaVu Sans, Helvetica, Arial, sans-serif;
            font-size: 9pt;
            color: #171717;
        }
        .sheet {
            width: 100%;
            max-height: 287mm;
            page-break-after: avoid;
            page-break-inside: avoid;
        }
        table.halves {
            width: 100%;
            border-collapse: collapse;
            table-layout: fixed;
            page-break-inside: avoid;
        }
        table.halves tr {
            page-break-inside: avoid;
        }
        /* Une colonne : chaque <tr> = une ligne pleine largeur (haut puis bas) */
        table.halves td {
            width: 100%;
            height: 132mm;
            vertical-align: top;
            border: 1.2px dashed #444;
            padding: 4mm;
            overflow: hidden;
        }
        .cut-hint {
            text-align: center;
            font-size: 7pt;
            color: #888;
            padding: 0 0 2mm 0;
            margin-bottom: 1mm;
        }
    </style>
</head>
<body>
<div class="sheet">
    <div class="cut-hint">— Une page A4 : deux bordereaux l’un sous l’autre — découper horizontalement au milieu —</div>
    <table class="halves">
        <tr>
            <td>
                @include('pdf.partials.order-ticket-block', [
                    'order' => $order,
                    'financial' => $financial,
                    'half' => $halves[0],
                ])
            </td>
        </tr>
        <tr>
            <td>
                @include('pdf.partials.order-ticket-block', [
                    'order' => $order,
                    'financial' => $financial,
                    'half' => $halves[1],
                ])
            </td>
        </tr>
    </table>
</div>
</body>
</html>
