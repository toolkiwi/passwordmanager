/**
 * Background tag colors
 */
export const TAG_COLORS = [
    '#FF4C4C',
    '#FF6EC7',
    '#FFD700',
    '#00FFFF',
    '#7FFF00',
    '#FF8C00',
    '#FF1493',
    '#00FF7F',
    '#BA55D3',
    '#6C757D',
    '#343A40',
];

/**
 * Pick random color inside the array
 * @returns {string} Color
 */
export const getRandomTagColor = () =>
    TAG_COLORS[Math.floor(Math.random() * TAG_COLORS.length)];
