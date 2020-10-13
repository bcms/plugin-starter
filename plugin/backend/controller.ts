import { ResponseCode } from '@becomes/cms-backend';
import {
  Controller,
  ControllerPrototype,
  Get,
  HttpErrorFactory,
  HttpStatus,
  JWTConfigService,
  JWTEncryptionAlg,
  JWTSecurity,
  Logger,
  PermissionName,
  RoleName,
} from '@becomes/purple-cheetah';
import type { Request, Router } from 'express';

JWTConfigService.add({
  id: 'user-token-config',
  alg: JWTEncryptionAlg.HMACSHA256,
  expIn: parseInt(process.env.JWT_EXP_AFTER, 10),
  issuer: process.env.JWT_ISSUER,
  secret: process.env.JWT_SECRET,
});

@Controller('/api/plugin/my-awesome-plugin')
export class PluginController implements ControllerPrototype {
  name = 'MyAwesomePluginController';
  baseUri: string;
  initRouter: any;
  logger: Logger;
  router: Router;

  @Get('/hello')
  async hello(request: Request): Promise<{ message: string }> {
    const error = HttpErrorFactory.instance('hello', this.logger);
    const jwt = JWTSecurity.checkAndValidateAndGet(
      request.headers.authorization,
      {
        roles: [RoleName.ADMIN, RoleName.USER],
        permission: PermissionName.READ,
        JWTConfig: JWTConfigService.get('user-token-config'),
      },
    );
    if (jwt instanceof Error) {
      throw error.occurred(
        HttpStatus.UNAUTHORIZED,
        ResponseCode.get('g001', {
          msg: jwt.message,
        }),
      );
    }
    return { message: 'Hello world!' };
  }
}
