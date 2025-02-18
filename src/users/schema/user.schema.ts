import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { Expense } from "src/expenses/schema/expense.schema";

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ type: String })
  firstName: string;

  @Prop({ type: String })
  lastName: string;

  @Prop({ type: String })
  email: string;

  @Prop({ type: String })
  phoneNumber: string;

  @Prop({ type: String })
  gender: string;

  @Prop({ type: String })
  subscriptionDate: string;

  @Prop([{ type: Types.ObjectId, ref: 'Expense' }])
  expenses: Expense[];
}

export const UserSchema = SchemaFactory.createForClass(User);
