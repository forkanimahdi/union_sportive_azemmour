<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class YoutubeFeedController extends Controller
{
    public function channelVideos(Request $request)
    {
        $channelId = (string) $request->query('channelId', '');
        $channelId = trim($channelId);

        if ($channelId === '') {
            return response()->json(['message' => 'channelId is required'], 422);
        }

        // Basic validation to avoid weird inputs
        if (!preg_match('/^[A-Za-z0-9_-]{10,100}$/', $channelId)) {
            return response()->json(['message' => 'channelId is invalid'], 422);
        }

        $limit = (int) $request->query('limit', 6);
        $limit = max(1, min(20, $limit));

        $cacheKey = "youtube:rss:channel:{$channelId}:limit:{$limit}";

        $payload = Cache::remember($cacheKey, now()->addMinutes(20), function () use ($channelId, $limit) {
            $url = 'https://www.youtube.com/feeds/videos.xml';

            $res = Http::timeout(10)
                ->retry(2, 250)
                ->get($url, ['channel_id' => $channelId]);

            if (!$res->ok()) {
                return [
                    'channelId' => $channelId,
                    'videos' => [],
                    'error' => 'Failed to fetch YouTube feed',
                ];
            }

            $xml = @simplexml_load_string($res->body());
            if (!$xml) {
                return [
                    'channelId' => $channelId,
                    'videos' => [],
                    'error' => 'Invalid feed XML',
                ];
            }

            $ns = $xml->getNamespaces(true);
            $videos = [];

            foreach ($xml->entry as $entry) {
                $yt = isset($ns['yt']) ? $entry->children($ns['yt']) : null;
                $videoId = $yt?->videoId ? (string) $yt->videoId : null;
                if (!$videoId) {
                    continue;
                }

                $title = (string) ($entry->title ?? '');
                $published = (string) ($entry->published ?? '');

                // "media" namespace sometimes contains thumbnails, but videoId thumbnail is reliable.
                $thumb = "https://i.ytimg.com/vi/{$videoId}/hqdefault.jpg";

                $videos[] = [
                    'videoId' => $videoId,
                    'title' => $title,
                    'publishedAt' => $published,
                    'thumbnail' => $thumb,
                    'embedUrl' => "https://www.youtube.com/embed/{$videoId}",
                    'watchUrl' => "https://www.youtube.com/watch?v={$videoId}",
                ];

                if (count($videos) >= $limit) {
                    break;
                }
            }

            return [
                'channelId' => $channelId,
                'videos' => $videos,
            ];
        });

        return response()->json($payload);
    }
}

