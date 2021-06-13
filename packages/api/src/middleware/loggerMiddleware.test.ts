import { Request, Response, NextFunction } from 'express';
import { loggerMiddleware } from './loggerMiddleware';

describe('Logger middleware', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('Attaches a child logger with request context', () => {
    const mockRequest: Partial<Request> = {};
    const mockResponse: Partial<Response> = { json: jest.fn(), once: jest.fn() };
    const nextFunction: NextFunction = jest.fn()

    loggerMiddleware(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockRequest.logger).not.toBeUndefined()
  });
});
