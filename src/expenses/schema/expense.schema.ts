import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { User } from 'src/users/schema/user.schema';

@Schema({ timestamps: true })
export class Expense extends Document {
  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  productName: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  totalPrice: number;

  @Prop({type: mongoose.Schema.Types.ObjectId, ref: User.name})
  user: mongoose.Schema.Types.ObjectId
}

export const ExpenseSchema = SchemaFactory.createForClass(Expense);
