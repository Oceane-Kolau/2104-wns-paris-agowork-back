import { Field, ID, ObjectType } from "type-graphql";
import { Prop, getModelForClass, Ref } from "@typegoose/typegoose";
import { MaxLength, Length } from "class-validator";

@ObjectType()
export class Campus {
  @Field(() => ID)
  id!: string;

  @Field()
  @Length(5, 100)
  @Prop({ unique: true, required: true })
  name!: string;

  @Field()
  @MaxLength(70)
  @Prop({ required: false })
  address!: string;

  @Field()
  @MaxLength(10)
  @Prop({ required: false })
  phone!: string;
}

export const CampusModel = getModelForClass(Campus, {
  schemaOptions: { timestamps: true },
});
