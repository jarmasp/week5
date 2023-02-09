import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";

export type UsersDocument = Users & Document;

@Schema()
export class Users {
  @Prop({ required: true, unique: true })
  public name: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  savedNews: Array<object>;
}

export const UsersSchema = SchemaFactory.createForClass(Users);
