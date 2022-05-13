import {
  Resolver,
  Query,
  Arg,
  Mutation,
  Ctx,
  Authorized,
  ID,
} from "type-graphql";
import { User } from "../../models/userModel/user.schema";
import { UserModel } from "../../models/userModel/user.schema";
import { Context } from "../../utilitaire/context.type";
import { Role } from "../../models/userModel/role.enum";
import { MoodInput } from "../../models/moodModel/mood.input";
import { Mood, MoodModel } from "../../models/moodModel/mood.schema";
import { CampusModel } from "../../models/campusModel/campus.schema";

@Resolver(Mood)
export default class MoodResolver {
  @Authorized(["ADMIN", "STUDENT", "TEACHER"])
  @Query(() => [Mood])
  async getMoods(): Promise<Mood[]> {
    const mood = await MoodModel.find().sort({ updatedAt: -1 }).exec();
    return mood;
  }

  @Authorized(["ADMIN", "STUDENT", "TEACHER"])
  @Mutation(() => User)
  public async updateUserMood(
    @Arg("id", () => ID) id: string,
    @Arg("email", () => String) email: string,
  ): Promise<object | null> {
    const updatedUser = await UserModel.findOneAndUpdate(
      { email: email },
      { mood: id },
      {
        new: true,
      },
    )
      .populate("mood")
      .exec();
    return updatedUser;
  }

  @Authorized(["ADMIN"])
  @Mutation(() => Mood, { nullable: true })
  public async deleteMood(@Arg("id", () => ID) id: string) {
    const mood = await MoodModel.findByIdAndDelete(id);
    if (!mood) throw new Error("Aucun mood ne correspond à la demande");
    return mood;
  }

  @Authorized(["ADMIN"])
  @Mutation(() => Mood)
  public async createMood(
    @Arg("input") input: MoodInput,
  ): Promise<object | null> {
    const mood = new MoodModel(input);
    await mood.save();
    return mood;
  }

  @Authorized(["ADMIN"])
  @Mutation(() => Mood)
  public async updateMood(
    @Arg("input") input: MoodInput,
  ): Promise<object | null> {
    const updatedMood = await MoodModel.findOneAndUpdate(
      { _id: input.id },
      { ...input },
      { returnOriginal: false },
    ).exec();

    if (!updatedMood) {
      throw new Error(
        "La modification n'a pas pu être effectuée. Si cela persiste, contactez vore administrateur",
      );
    }

    return updatedMood;
  }
}
