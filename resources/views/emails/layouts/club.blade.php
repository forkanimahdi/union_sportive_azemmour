{{--
    Reusable email layout – Union Sportive Azemmour
    Club colors: primary #571123 (alpha), dark #171717 (dark)
    Only @yield('content') is dynamic per email.
--}}
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'Union Sportive Azemmour')</title>
</head>
<body style="margin:0; padding:0; background-color:#f0f0f0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f0f0f0;">
        <tr>
            <td align="center" style="padding: 32px 16px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 560px; background-color:#ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
                    {{-- Header with club colors --}}
                    <tr>
                        <td style="background-color:#571123; padding: 24px 32px; text-align: center;">
                            <h1 style="margin:0; color:#ffffff; font-size: 20px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase;">
                                Union Sportive Azemmour
                            </h1>
                            <p style="margin: 8px 0 0 0; color: rgba(255,255,255,0.85); font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase;">
                                Football Féminin
                            </p>
                        </td>
                    </tr>
                    {{-- Dynamic content --}}
                    <tr>
                        <td style="padding: 32px; color:#171717; font-size: 15px; line-height: 1.6;">
                            @yield('content')
                        </td>
                    </tr>
                    {{-- Footer --}}
                    <tr>
                        <td style="background-color:#171717; padding: 20px 32px; text-align: center;">
                            <p style="margin:0; color: rgba(255,255,255,0.8); font-size: 12px;">
                                Union Sportive Azemmour – Tininat Azemmour
                            </p>
                            <p style="margin: 6px 0 0 0; color: rgba(255,255,255,0.6); font-size: 11px;">
                                Merci de votre confiance.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
