import { Module } from '@nestjs/common';
import { User, UserSchema } from './schemas/user.schema';
import { Session, SessionSchema } from './schemas/session.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UserRepository } from 'src/repositories/user.repository';
import { SessionRepository } from 'src/repositories/session.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Session.name, schema: SessionSchema },
    ]),
  ],
  providers: [UserRepository, SessionRepository],
  exports: [UserRepository, SessionRepository],
})
export class DatabaseModule {}
