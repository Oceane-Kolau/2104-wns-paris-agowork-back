import { Field, ID, ObjectType } from "type-graphql";
import { Prop, getModelForClass } from "@typegoose/typegoose";
import { Length, MaxLength } from "class-validator";

@ObjectType()
export class Mood {
  @Field(() => ID)
  id!: string;

  @Field(() => String, { nullable: false })
  @MaxLength(10)
  @Prop({ required: true, unique: true })
  name!: string;

  @Field(() => String, { nullable: false })
  @Length(1, 40)
  @Prop({ required: true, unique: true })
  icon!: string;
}

export const MoodModel = getModelForClass(Mood, {
  schemaOptions: { timestamps: true },
});
