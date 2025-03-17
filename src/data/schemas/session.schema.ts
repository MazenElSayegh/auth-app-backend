import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Session extends Document {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  refreshToken: string;

  @Prop({ required: true })
  sessionId: string;

  @Prop({
    type: Date,
    required: true,
    index: { expires: 0 },
  })
  expiresAt: Date;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
