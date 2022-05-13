import { Resolver, Query, Arg, Mutation, Authorized, ID } from "type-graphql";
import { CampusInput } from "../../models/campusModel/campus.input";
import { Campus, CampusModel } from "../../models/campusModel/campus.schema";

@Resolver(Campus)
export default class CampusResolver {
  @Authorized(["ADMIN"])
  @Mutation(() => Campus)
  async createCampus(@Arg("input") input: CampusInput): Promise<Campus | null> {
    const campus = new CampusModel(input);
    await campus.save();
    return campus;
  }

  @Authorized(["ADMIN", "STUDENT", "TEACHER"])
  @Query(() => [Campus])
  async getCampus(): Promise<Campus[]> {
    const campus = await CampusModel.find().sort({ updatedAt: -1 }).exec();
    return campus;
  }

  @Authorized(["ADMIN"])
  @Mutation(() => Campus, { nullable: true })
  public async deleteCampus(@Arg("id", () => ID) id: string) {
    const campus = await CampusModel.findByIdAndDelete(id);
    if (!campus) throw new Error("Aucun campus ne correspond à la demande");
    return campus;
  }

  @Authorized(["ADMIN"])
  @Mutation(() => Campus)
  public async updateCampus(
    @Arg("input") input: CampusInput,
  ): Promise<object | null> {
    const updatedCampus = await CampusModel.findOneAndUpdate(
      { _id: input.id },
      { ...input },
      { returnOriginal: false },
    );

    if (!updatedCampus)
      throw new Error("La modification n'a pas pu être effectuée.");

    return updatedCampus;
  }
}
