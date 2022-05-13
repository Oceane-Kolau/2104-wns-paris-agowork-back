import { Field, ID, ObjectType } from "type-graphql";
import { Prop, getModelForClass, Ref } from "@typegoose/typegoose";
import { Role } from "./role.enum";
import { Campus } from "../campusModel/campus.schema";
import { Mood } from "../moodModel/mood.schema";
import { IsEmail, Length, MaxLength, IsBoolean } from "class-validator";

@ObjectType()
export class User {
  @Field(() => ID)
  id!: string;

  @Field(() => Role)
  @Prop({ enum: Role, type: String, required: true })
  role!: Role;

  @Field()
  @MaxLength(20)
  @Prop({ trim: true, required: true })
  firstname!: string;

  @Field()
  @MaxLength(20)
  @Prop({ trim: true, required: true })
  lastname!: string;

  @Field()
  @IsEmail()
  @Prop({ trim: true, required: true, unique: true })
  email!: string;

  @Prop({ trim: true, required: true })
  @Length(8, 32)
  password!: string;

  @Field(() => String, { nullable: true })
  @MaxLength(30)
  @Prop({ trim: true, required: false })
  town?: string;

  @Field(() => String, { nullable: true })
  @Prop({ trim: true, required: false })
  picture?: string;

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @Prop()
  needHelp?: Boolean;

  @Field(() => Campus, { nullable: true })
  @Prop({ ref: () => Campus, type: () => ID })
  public campus!: Ref<Campus>;

  @Field(() => Mood, { nullable: true })
  @Prop({ ref: () => Mood, type: () => ID })
  public mood?: Ref<Mood>;
}

export const UserModel = getModelForClass(User, {
  schemaOptions: { timestamps: true },
});
