<?php

namespace App\Services;

use App\Models\Player;

/**
 * Mandatory "Fit to Play" gatekeeping before adding a player to a Match Convocation.
 * Validates: Medical gate (Apte), Disciplinary gate (no active suspension), Administrative gate (license + parental auth for minors).
 */
final class FitToPlayGate
{
    /**
     * Returns null if the player can be added to a convocation, or the block reason string otherwise.
     */
    public static function canBeConvoked(Player $player): ?string
    {
        return $player->getFitToPlayBlockReason();
    }

    /**
     * Returns true if the player is fit to be added to a match convocation.
     */
    public static function isFitToPlay(Player $player): bool
    {
        return $player->canPlay();
    }
}
