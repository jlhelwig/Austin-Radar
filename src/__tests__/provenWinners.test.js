/**
 * Proven Winners Seed Data Tests
 *
 * Validates the structure and integrity of the seeded venue data.
 */

import provenWinners from '../data/proven_winners.json';

describe('Proven Winners Seed Data', () => {
  it('should contain at least 1 entry', () => {
    expect(provenWinners.length).toBeGreaterThan(0);
  });

  it('every entry should have required fields', () => {
    provenWinners.forEach((gem) => {
      expect(gem).toHaveProperty('id');
      expect(gem).toHaveProperty('name');
      expect(gem).toHaveProperty('category');
      expect(gem).toHaveProperty('coordinates');
      expect(gem).toHaveProperty('coordinates.latitude');
      expect(gem).toHaveProperty('coordinates.longitude');
      expect(gem).toHaveProperty('stars');
      expect(gem).toHaveProperty('instructions');
    });
  });

  it('all stars should be 4 or 5 (per Code_Rules.md)', () => {
    provenWinners.forEach((gem) => {
      expect(gem.stars).toBeGreaterThanOrEqual(4);
      expect(gem.stars).toBeLessThanOrEqual(5);
    });
  });

  it('all coordinates should be near Austin, TX', () => {
    provenWinners.forEach((gem) => {
      const { latitude, longitude } = gem.coordinates;
      // Austin bounding box: lat [30.1, 30.5], lng [-97.9, -97.6]
      expect(latitude).toBeGreaterThan(30.1);
      expect(latitude).toBeLessThan(30.5);
      expect(longitude).toBeGreaterThan(-97.9);
      expect(longitude).toBeLessThan(-97.6);
    });
  });

  it('all IDs should be unique', () => {
    const ids = provenWinners.map(g => g.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
