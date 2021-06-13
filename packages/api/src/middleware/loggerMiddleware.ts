import { logger } from '../logger';
import { Request, Response, NextFunction } from 'express';

const onRequestComplete = (req: Request, res: Response) => {
  req.logger?.info({
    msg: 'Completed request',
    req: {
      method: req.method,
      path: req.path,
      query: req.query
    },
    res: {
      status: res.statusCode,
      time: Date.now() - (req.startTime || 0)
    }
  });
};

export const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  req.startTime = Date.now()
  req.logger = logger.child({});

  req.logger.info({
    msg: 'Started request',
    req: {
      method: req.method,
      path: req.path,
      query: req.query
    }
  });

  res.once('finish', () => onRequestComplete(req, res));
  res.once('error', () => onRequestComplete(req, res));

  next();
}