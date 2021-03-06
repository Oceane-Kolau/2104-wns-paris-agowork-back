import { Resolver, Arg, Mutation } from "type-graphql";
import bcrypt from "bcryptjs";
import { UserModel } from "../../models/userModel/user.schema";
import { AuthenticationError } from "apollo-server";
import { getToken } from "../../utilitaire/security";
import { CampusModel } from "../../models/campusModel/campus.schema";
import { MoodModel } from "../../models/moodModel/mood.schema";
import Token from "../../utilitaire/token.type";

@Resolver(Token)
export default class LoginResolver {
  @Mutation(() => Token)
  async login(
    @Arg("password", () => String) password: string,
    @Arg("email", () => String) email: string,
  ): Promise<Token> {
    let campus;
    let mood;
    const user = await UserModel.findOne({ email: email });
    if (!user) throw new AuthenticationError("Vous n'avez pas de compte");
    if (user.campus) campus = await CampusModel.findById({ _id: user.campus }).exec();
    if (user.mood) mood = await MoodModel.findById({ _id: user.mood }).exec();
    
    if (user && bcrypt.compareSync(password, user.password)) {
      const payload = {
        email: user.email,
        role: user.role,
        campus: campus?.name,
        mood: mood?.icon,
        firstname: user.firstname,
        lastname: user.lastname,
      };

      return { token: getToken(payload) };
    } else {
      throw new AuthenticationError("Mauvais identifiant");
    }
  }
}
