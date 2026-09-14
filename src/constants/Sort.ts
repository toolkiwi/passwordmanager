/**
 * All available sort options for the lists
 */
export const SORT_OPTIONS = ['recent', 'oldest', 'title_asc', 'title_desc', 'updated'] as const;

/**
 * Type of a single sort option
 */
export type SortOption = (typeof SORT_OPTIONS)[number];

/**
 * Sort option applied by default on every list
 */
export const SORT_DEFAULT: SortOption = 'recent';
