import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Session } from '../data/schemas/session.schema';
import { AuthDto } from '../modules/auth/auth.dto';

@Injectable()
export class SessionRepository {
  constructor(
    @InjectModel(Session.name) private readonly sessionModel: Model<Session>,
  ) {}

  async createSession(session: AuthDto.SessionReq): Promise<Session | null> {
    const existingSession = await this.findSession(session);
    if (existingSession)
      throw new ConflictException('Session is already in use');
    const newSession = new this.sessionModel(session);
    return newSession.save();
  }

  findSession(session: AuthDto.Session): Promise<Session | null> {
    const { email, sessionId } = session;
    return this.sessionModel.findOne({ email, sessionId }).exec();
  }

  deleteSession(session: AuthDto.Session) {
    const { email, sessionId } = session;
    return this.sessionModel.deleteOne({ email, sessionId }).exec();
  }
}
