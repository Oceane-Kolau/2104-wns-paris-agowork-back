import { Resolver, Query, Arg, Mutation, Ctx, Authorized } from "type-graphql";
import { User } from "../../models/userModel/user.schema";
import { UserModel } from "../../models/userModel/user.schema";
import bcrypt from "bcryptjs";
import { Context } from "../../utilitaire/context.type";
import { UserInput } from "../../models/userModel/user.input";
import { CampusModel } from "../../models/campusModel/campus.schema";
import { Role } from "../../models/userModel/role.enum";

@Resolver(User)
export default class UserResolver {
  @Query(() => User)
  async getLoggedUserByEmail(@Ctx() ctx: Context): Promise<User> {
    const user = await UserModel.findOne({ email: ctx.email })
      .populate("campus")
      .populate("mood")
      .exec();
    if (!user) throw new Error("Aucun utilisateur trouvé");
    return user;
  }

  @Authorized(["ADMIN", "STUDENT", "TEACHER"])
  @Query(() => [User])
  public async getAllStudentsBySocial(@Ctx() ctx: Context): Promise<User[]> {
    const role = "STUDENT" as Role;
    const campus = await CampusModel.findOne({ name: ctx.campus });
    const campusId = campus?._id;
    const users = await UserModel.find({ role, campus: campusId })
      .limit(10)
      .populate("mood")
      .exec();
    return users;
  }

  @Authorized(["ADMIN", "STUDENT", "TEACHER"])
  @Mutation(() => Boolean)
  async updateNeedHelp(
    @Ctx() ctx: Context,
    @Arg("needHelp", () => Boolean) needHelp: Boolean,
  ): Promise<Boolean> {
    const updatedHelp = needHelp;
    const updatedUser = await UserModel.findOneAndUpdate(
      { email: ctx.email },
      { needHelp: needHelp as Boolean },
    ).exec();
    if (!updatedUser) throw new Error("Aucun utilisateur trouvé");
    return updatedHelp;
  }

  @Authorized(["ADMIN", "STUDENT", "TEACHER"])
  @Mutation(() => User)
  async updateUser(@Arg("input") input: UserInput): Promise<User | null> {
    let password;

    if (input.password === null || input.password === undefined || input.password === "") {
      const user = await UserModel.findById({ _id: input.id });
      if (!user) {
        throw new Error("Utilisateur introuvable");
      }
      password = user.password;
    } else {
      password = bcrypt.hashSync(input.password, 12);
    }

    const body: any = {
      firstname: input.firstname,
      lastname: input.lastname,
      email: input.email,
      town: input.town,
      password: password,
      role: input.role,
      campus: input.campus,
    };

    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: input.id },
      body,
      { returnOriginal: false },
    )
      .populate("campus")
      .populate("mood")
      .exec();

    if (!updatedUser) {
      throw new Error(
        "La modification n'a pas pu être effectuée.",
      );
    }

    return updatedUser;
  }
}
