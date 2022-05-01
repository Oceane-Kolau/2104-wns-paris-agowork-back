import { Field, ID, ObjectType } from "type-graphql";
import { Prop, getModelForClass, mongoose } from "@typegoose/typegoose";

@ObjectType()
export class Ressource {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  @Prop({ trim: true, unique: true })
  title!: string;

  @Field(() => String)
  @Prop({ trim: true, unique: true })
  link!: string;

  @Field(() => String, { nullable: true })
  @Prop({ trim: true, required: false, unique: false })
  description?: string;

  @Field(() => [String], { nullable: true })
  @Prop({ type: String, required: false, unique: false })
  tags?: mongoose.Types.Array<string>;
}

export const RessourceModel = getModelForClass(Ressource, {
  schemaOptions: { timestamps: true },
});
