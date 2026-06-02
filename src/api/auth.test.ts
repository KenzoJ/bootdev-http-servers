import { describe, it, vi, expect } from 'vitest';
import { getBearerToken } from '../auth.js';
import { Unauthorized } from './errors.js';

describe("getBearerToken", () => {
  it('should return just the auth token in string', () => {
    const req = {
      get: vi.fn().mockReturnValue('Bearer test123'),
    } as any;
    const token = getBearerToken(req);
    expect(req.get).toHaveBeenCalledWith('Authorization');
    expect(token).toBe('test123');
  })

  describe("getBearerToken 2", () => {
    it('should throw Unauth if header missing', () => {
      const req = {
        get: vi.fn().mockReturnValue(undefined),
      } as any;

      expect(() => getBearerToken(req)).toThrowError(Unauthorized)
      expect(req.get).toHaveBeenCalledWith('Authorization')
    })
  });

})

