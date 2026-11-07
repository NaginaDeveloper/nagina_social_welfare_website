import { HttpErrorResponse } from '@angular/common/http';
import { describe, expect, it, vi } from 'vitest';
import { isRetryableHttpError, withRetry } from './membership.service';

const httpError = (status: number) => new HttpErrorResponse({ status });
const noSleep = () => Promise.resolve();

describe('membership submit retry', () => {
  it('retries only network and server errors', () => {
    expect(isRetryableHttpError(httpError(0))).toBe(true);
    expect(isRetryableHttpError(httpError(500))).toBe(true);
    expect(isRetryableHttpError(httpError(503))).toBe(true);
    expect(isRetryableHttpError(httpError(400))).toBe(false);
    expect(isRetryableHttpError(httpError(409))).toBe(false);
    expect(isRetryableHttpError(httpError(429))).toBe(false);
    expect(isRetryableHttpError(new Error('x'))).toBe(false);
  });

  it('succeeds after transient failures', async () => {
    const run = vi
      .fn()
      .mockRejectedValueOnce(httpError(0))
      .mockRejectedValueOnce(httpError(500))
      .mockResolvedValue('ok');
    await expect(withRetry(run, [1, 1], noSleep)).resolves.toBe('ok');
    expect(run).toHaveBeenCalledTimes(3);
  });

  it('gives up after the last retry', async () => {
    const run = vi.fn().mockRejectedValue(httpError(0));
    await expect(withRetry(run, [1, 1], noSleep)).rejects.toMatchObject({ status: 0 });
    expect(run).toHaveBeenCalledTimes(3);
  });

  it('does not retry a final answer', async () => {
    const run = vi.fn().mockRejectedValue(httpError(400));
    await expect(withRetry(run, [1, 1], noSleep)).rejects.toMatchObject({ status: 400 });
    expect(run).toHaveBeenCalledTimes(1);
  });
});
