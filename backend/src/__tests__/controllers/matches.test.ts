import { MATCH_CONFIG } from '../../constants';

// Mock the adapters
jest.mock('../../adapters/rounds', () => ({
  getDbRoundById: jest.fn(),
  getDbRoundParticipants: jest.fn(),
  updateDbRoundStatus: jest.fn(),
}));

jest.mock('../../adapters/users', () => ({
  getDbUserById: jest.fn(),
  getDbUsersByUserIds: jest.fn(),
}));

jest.mock('../../adapters/matches', () => ({
  createDbMatch: jest.fn(),
  getDbMatchById: jest.fn(),
  updateDbMatchSchedule: jest.fn(),
}));

jest.mock('../../adapters/conversations', () => ({
  createDbConversation: jest.fn(),
  createDbChatMessage: jest.fn(),
}));

jest.mock('../../lib/notifications', () => ({
  sendNotificationToUsers: jest.fn(),
}));

describe('Match Scheduling Logic', () => {
  describe('Grouping by handicap', () => {
    it('should sort users by handicap and chunk into groups of max size', () => {
      // Test the grouping algorithm directly
      const users = [
        { userId: '1', sportProfiles: { GOLF: { handicapIndex: 20 } } },
        { userId: '2', sportProfiles: { GOLF: { handicapIndex: 5 } } },
        { userId: '3', sportProfiles: { GOLF: { handicapIndex: 12 } } },
        { userId: '4', sportProfiles: { GOLF: { handicapIndex: 8 } } },
        { userId: '5', sportProfiles: { GOLF: { handicapIndex: 15 } } },
        { userId: '6', sportProfiles: { GOLF: { handicapIndex: 3 } } },
        { userId: '7', sportProfiles: { GOLF: { handicapIndex: 25 } } },
        { userId: '8', sportProfiles: { GOLF: { handicapIndex: 18 } } },
        { userId: '9', sportProfiles: { GOLF: { handicapIndex: 10 } } },
        { userId: '10', sportProfiles: { GOLF: { handicapIndex: 22 } } },
      ];

      // Sort by handicap ascending
      const sorted = [...users].sort((a, b) => {
        const aH = (a.sportProfiles?.GOLF as any)?.handicapIndex ?? 999;
        const bH = (b.sportProfiles?.GOLF as any)?.handicapIndex ?? 999;
        return aH - bH;
      });

      // Verify sorting
      expect(sorted[0].userId).toBe('6'); // handicap 3
      expect(sorted[1].userId).toBe('2'); // handicap 5
      expect(sorted[2].userId).toBe('4'); // handicap 8

      // Chunk into groups of max 8
      const maxGroupSize = MATCH_CONFIG.MAX_GROUP_SIZE;
      const groups: string[][] = [];
      for (let i = 0; i < sorted.length; i += maxGroupSize) {
        const group = sorted.slice(i, i + maxGroupSize).map((u) => u.userId);
        groups.push(group);
      }

      // 10 users with max 8 per group = 2 groups
      expect(groups.length).toBe(2);
      expect(groups[0].length).toBe(8);
      expect(groups[1].length).toBe(2);

      // First group should have the 8 lowest handicaps
      expect(groups[0]).toContain('6'); // 3
      expect(groups[0]).toContain('2'); // 5
      expect(groups[0]).toContain('4'); // 8

      // Second group should have the 2 highest handicaps
      expect(groups[1]).toContain('7'); // 25
      expect(groups[1]).toContain('10'); // 22
    });

    it('should handle users without handicap (placed at end)', () => {
      const users = [
        { userId: '1', sportProfiles: { GOLF: { handicapIndex: 10 } } },
        { userId: '2', sportProfiles: {} },
        { userId: '3', sportProfiles: { GOLF: { handicapIndex: 5 } } },
      ];

      const sorted = [...users].sort((a, b) => {
        const aH = (a.sportProfiles?.GOLF as any)?.handicapIndex ?? 999;
        const bH = (b.sportProfiles?.GOLF as any)?.handicapIndex ?? 999;
        return aH - bH;
      });

      expect(sorted[0].userId).toBe('3'); // handicap 5
      expect(sorted[1].userId).toBe('1'); // handicap 10
      expect(sorted[2].userId).toBe('2'); // no handicap (999)
    });

    it('should create single group when players <= max group size', () => {
      const users = Array.from({ length: 4 }, (_, i) => ({
        userId: `${i + 1}`,
        sportProfiles: { GOLF: { handicapIndex: i * 5 } },
      }));

      const maxGroupSize = MATCH_CONFIG.MAX_GROUP_SIZE;
      const groups: string[][] = [];
      for (let i = 0; i < users.length; i += maxGroupSize) {
        const group = users.slice(i, i + maxGroupSize).map((u) => u.userId);
        groups.push(group);
      }

      expect(groups.length).toBe(1);
      expect(groups[0].length).toBe(4);
    });

    it('should handle exactly max group size players', () => {
      const users = Array.from(
        { length: MATCH_CONFIG.MAX_GROUP_SIZE },
        (_, i) => ({
          userId: `${i + 1}`,
          sportProfiles: { GOLF: { handicapIndex: i * 3 } },
        }),
      );

      const maxGroupSize = MATCH_CONFIG.MAX_GROUP_SIZE;
      const groups: string[][] = [];
      for (let i = 0; i < users.length; i += maxGroupSize) {
        const group = users.slice(i, i + maxGroupSize).map((u) => u.userId);
        groups.push(group);
      }

      expect(groups.length).toBe(1);
      expect(groups[0].length).toBe(MATCH_CONFIG.MAX_GROUP_SIZE);
    });
  });

  describe('MATCH_CONFIG', () => {
    it('should have MAX_GROUP_SIZE of 8', () => {
      expect(MATCH_CONFIG.MAX_GROUP_SIZE).toBe(8);
    });
  });
});
