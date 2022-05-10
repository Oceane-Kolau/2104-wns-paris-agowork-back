import { Field, ID, InputType } from "type-graphql";
import { Mood } from "./mood.schema";

@InputType()
export class MoodInput implements Partial<Mood> {
  @Field(() => ID, { nullable: true })
  id?: string;
  
  @Field(() => String, { nullable: false })
  name!: string;

  @Field(() => String, { nullable: false })
  icon!: string;
}
