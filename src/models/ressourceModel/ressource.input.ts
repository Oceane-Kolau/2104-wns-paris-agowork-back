import { Field, InputType } from "type-graphql";
import { Length } from "class-validator";
import { Ressource } from "./ressource.schema";
import mongoose from "mongoose";

@InputType()
export default class RessourceInput extends Ressource {
  @Field(() => String)
  @Length(1, 255)
  title!: string;

  @Field(() => String)
  @Length(1, 255)
  link!: string;

  @Field(() => [String])
  tags!: mongoose.Types.Array<string>;
}
