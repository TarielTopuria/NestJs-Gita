import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { User } from "src/users/schema/user.schema";

@Schema({ timestamps: true })
export class Product extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  category: string;

  @Prop({ default: () => new Date().toISOString() })
  createdAt: string;

  @Prop({ default: 'en' })
  lang: string;

  @Prop({type: mongoose.Schema.Types.ObjectId, ref: User.name})
  user: mongoose.Schema.Types.ObjectId
}

export const ProductSchema = SchemaFactory.createForClass(Product);
