import { Injectable } from '@nestjs/common';
import * as pkg from '../package.json';

@Injectable()
export class AppService {
  getHealth() {
    return {
      status: 'ok',
      service: pkg.name,
      version: pkg.version,
      description: pkg.description,
      environment: process.env.NODE_ENV ?? 'development',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
}
