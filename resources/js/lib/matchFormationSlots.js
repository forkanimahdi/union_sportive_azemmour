/**
 * Coordonnées % du terrain (top = gardienne / défense, bas = attaque).
 * Clés 1–11 = numéro de place titulaire.
 */

const SLOTS_433 = {
    1: { top: 6, left: 50 },
    2: { top: 20, left: 8 },
    3: { top: 18, left: 32 },
    4: { top: 18, left: 68 },
    5: { top: 20, left: 92 },
    6: { top: 38, left: 20 },
    7: { top: 40, left: 50 },
    8: { top: 38, left: 80 },
    9: { top: 58, left: 15 },
    10: { top: 62, left: 50 },
    11: { top: 58, left: 85 },
};

const SLOTS_442 = {
    1: { top: 6, left: 50 },
    2: { top: 20, left: 8 },
    3: { top: 18, left: 32 },
    4: { top: 18, left: 68 },
    5: { top: 20, left: 92 },
    6: { top: 40, left: 10 },
    7: { top: 40, left: 36 },
    8: { top: 40, left: 64 },
    9: { top: 40, left: 90 },
    10: { top: 62, left: 36 },
    11: { top: 62, left: 64 },
};

const SLOTS_352 = {
    1: { top: 6, left: 50 },
    2: { top: 21, left: 22 },
    3: { top: 20, left: 50 },
    4: { top: 21, left: 78 },
    5: { top: 40, left: 8 },
    6: { top: 38, left: 28 },
    7: { top: 40, left: 50 },
    8: { top: 38, left: 72 },
    9: { top: 40, left: 92 },
    10: { top: 62, left: 38 },
    11: { top: 62, left: 62 },
};

const SLOTS_451 = {
    1: { top: 6, left: 50 },
    2: { top: 20, left: 8 },
    3: { top: 18, left: 32 },
    4: { top: 18, left: 68 },
    5: { top: 20, left: 92 },
    6: { top: 38, left: 10 },
    7: { top: 36, left: 30 },
    8: { top: 40, left: 50 },
    9: { top: 36, left: 70 },
    10: { top: 38, left: 90 },
    11: { top: 64, left: 50 },
};

const SLOTS_4231 = {
    1: { top: 6, left: 50 },
    2: { top: 20, left: 8 },
    3: { top: 18, left: 32 },
    4: { top: 18, left: 68 },
    5: { top: 20, left: 92 },
    6: { top: 34, left: 35 },
    7: { top: 34, left: 65 },
    8: { top: 48, left: 22 },
    9: { top: 50, left: 50 },
    10: { top: 48, left: 78 },
    11: { top: 66, left: 50 },
};

const BY_FORMATION = {
    433: SLOTS_433,
    442: SLOTS_442,
    352: SLOTS_352,
    451: SLOTS_451,
    4231: SLOTS_4231,
};

export const FORMATION_OPTIONS = [
    { value: '433', label: '4-3-3' },
    { value: '442', label: '4-4-2' },
    { value: '352', label: '3-5-2' },
    { value: '451', label: '4-5-1' },
    { value: '4231', label: '4-2-3-1' },
];

export const DEFAULT_FORMATION = '433';

/**
 * @param {string} formation
 * @returns {Record<number, { top: number, left: number }>}
 */
export function getPitchSlots(formation) {
    const key = formation && BY_FORMATION[formation] ? formation : DEFAULT_FORMATION;
    return BY_FORMATION[key];
}
