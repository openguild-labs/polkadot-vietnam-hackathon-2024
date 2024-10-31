import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

export type AuthRequest = Request & { user: { address: string;} };

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}