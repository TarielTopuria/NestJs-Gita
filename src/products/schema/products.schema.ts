import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

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
}

export const ProductSchema = SchemaFactory.createForClass(Product);
