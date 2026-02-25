import {
  leagueCreateBodySchema,
  leagueParamsSchema,
  sportParamsSchema,
} from '../../models/league';
import { roundCreateBodySchema, roundParamsSchema } from '../../models/round';
import {
  conversationCreateBodySchema,
  messageBodySchema,
} from '../../models/conversation';

describe('Validation Schemas', () => {
  describe('sportParamsSchema', () => {
    it('should accept valid sport types', () => {
      expect(
        sportParamsSchema.validate({ sport: 'golf' }).error,
      ).toBeUndefined();
      expect(
        sportParamsSchema.validate({ sport: 'GOLF' }).error,
      ).toBeUndefined();
      expect(
        sportParamsSchema.validate({ sport: 'football' }).error,
      ).toBeUndefined();
      expect(
        sportParamsSchema.validate({ sport: 'basketball' }).error,
      ).toBeUndefined();
      expect(
        sportParamsSchema.validate({ sport: 'cricket' }).error,
      ).toBeUndefined();
    });

    it('should reject invalid sport types', () => {
      expect(
        sportParamsSchema.validate({ sport: 'tennis' }).error,
      ).toBeDefined();
      expect(
        sportParamsSchema.validate({ sport: 'hockey' }).error,
      ).toBeDefined();
      expect(sportParamsSchema.validate({ sport: '' }).error).toBeDefined();
    });
  });

  describe('leagueCreateBodySchema', () => {
    const validLeague = {
      name: 'Test League',
      description: 'A test league for golf enthusiasts',
      category: 'OPEN',
      region: 'London',
      location: {
        lat: 51.5074,
        lng: -0.1278,
        city: 'London',
        country: 'UK',
        address: '123 Golf St',
      },
      maxMembers: 100,
      entryFee: 1500,
      minPlayersPerRound: 4,
      maxPlayersPerRound: 8,
    };

    it('should accept valid league data', () => {
      const { error } = leagueCreateBodySchema.validate(validLeague);
      expect(error).toBeUndefined();
    });

    it('should reject league with short name', () => {
      const { error } = leagueCreateBodySchema.validate({
        ...validLeague,
        name: 'AB',
      });
      expect(error).toBeDefined();
    });

    it('should reject league with short description', () => {
      const { error } = leagueCreateBodySchema.validate({
        ...validLeague,
        description: 'Short',
      });
      expect(error).toBeDefined();
    });

    it('should reject invalid category', () => {
      const { error } = leagueCreateBodySchema.validate({
        ...validLeague,
        category: 'INVALID',
      });
      expect(error).toBeDefined();
    });

    it('should accept all valid categories', () => {
      const categories = [
        'OPEN',
        'WOMEN',
        'KIDS',
        'BEGINNERS',
        'SENIORS',
        'INTERMEDIATE',
        'ADVANCED',
      ];
      categories.forEach((category) => {
        const { error } = leagueCreateBodySchema.validate({
          ...validLeague,
          category,
        });
        expect(error).toBeUndefined();
      });
    });

    it('should reject missing required fields', () => {
      const { error } = leagueCreateBodySchema.validate({});
      expect(error).toBeDefined();
    });
  });

  describe('roundCreateBodySchema', () => {
    const validRound = {
      scheduledDate: '2026-03-15',
      scheduledTime: '08:00',
      venue: {
        name: 'Royal Links',
        address: '123 Golf Rd',
        lat: 51.5,
        lng: -0.1,
      },
      minPlayers: 4,
      maxPlayers: 8,
      entryFee: 1500,
      registrationDeadline: '2026-03-14',
    };

    it('should accept valid round data', () => {
      const { error } = roundCreateBodySchema.validate(validRound);
      expect(error).toBeUndefined();
    });

    it('should reject invalid date format', () => {
      const { error } = roundCreateBodySchema.validate({
        ...validRound,
        scheduledDate: 'not-a-date',
      });
      expect(error).toBeDefined();
    });

    it('should reject minPlayers less than 2', () => {
      const { error } = roundCreateBodySchema.validate({
        ...validRound,
        minPlayers: 1,
      });
      expect(error).toBeDefined();
    });
  });

  describe('messageBodySchema', () => {
    it('should accept valid message', () => {
      const { error } = messageBodySchema.validate({
        content: 'Hello!',
        type: 'TEXT',
      });
      expect(error).toBeUndefined();
    });

    it('should reject empty content', () => {
      const { error } = messageBodySchema.validate({ content: '' });
      expect(error).toBeDefined();
    });

    it('should accept IMAGE type', () => {
      const { error } = messageBodySchema.validate({
        content: 'image-url',
        type: 'IMAGE',
      });
      expect(error).toBeUndefined();
    });

    it('should default to TEXT type', () => {
      const { value } = messageBodySchema.validate({ content: 'Hello!' });
      expect(value.type).toBe('TEXT');
    });
  });
});
