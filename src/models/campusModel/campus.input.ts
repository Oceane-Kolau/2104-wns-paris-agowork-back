import { Field, ID, InputType } from "type-graphql";
import { Campus } from "./campus.schema";

@InputType()
export class CampusInput implements Partial<Campus> {
  @Field(() => ID, { nullable: true })
  id?: string;
  
  @Field({ nullable: false })
  name!: string;

  @Field({ nullable: true })
  address!: string;

  @Field({ nullable: true })
  phone!: string;
}
