import {
  Resolver,
  Query,
  Arg,
  Mutation,
  Authorized,
  ID,
  Ctx,
} from "type-graphql";
import {
  Ressource,
  RessourceModel,
} from "../../models/ressourceModel/ressource.schema";
import RessourceInput from "../../models/ressourceModel/ressource.input";
import { Context } from "../../utilitaire/context.type";

@Resolver(Ressource)
export default class RessourceResolver {
  @Authorized(["ADMIN", "TEACHER"])
  @Mutation(() => Ressource)
  async createRessource(
    @Ctx() ctx: Context,
    @Arg("input") input: RessourceInput,
  ): Promise<Ressource> {
    const regex = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    if (!input.link.match(regex)) throw new Error("Le lien de la ressource contient des éléments non validés");
    const ressource = await new RessourceModel({
      ...input,
      author: ctx.firstname.concat(" ", ctx.lastname),
    }).save();

    return ressource;
  }

  @Authorized(["ADMIN", "TEACHER"])
  @Mutation(() => Ressource, { nullable: true })
  async deleteRessource(@Arg("id", () => ID) id: string) {
    const deletedRessource = await RessourceModel.findByIdAndDelete(id);
    if (!deletedRessource)
      throw new Error("Aucune ressource ne correspond à la demande");
    return deletedRessource;
  }

  @Authorized(["ADMIN", "TEACHER"])
  @Query(() => [Ressource])
  async getAllRessources(): Promise<Ressource[]> {
    const ressources = await RessourceModel.find().sort({ updatedAt: -1 });
    return ressources;
  }

  @Authorized(["ADMIN", "TEACHER"])
  @Query(() => Ressource, { nullable: true })
  async getRessourceById(@Arg("id", () => ID) id: string) {
    const ressource = await RessourceModel.findById(id);
    if (!ressource)
      throw new Error("Aucune ressource ne correspond à la demande");
    return ressource;
  }

  @Authorized(["ADMIN", "TEACHER"])
  @Mutation(() => Ressource)
  async updateRessource(
    @Arg("input") input: RessourceInput,
  ): Promise<Ressource | null> {
    const updatedRessource = await RessourceModel.findOneAndUpdate(
      { _id: input.id },
      {
        ...input,
      },
      { returnOriginal: false },
    );

    if (!updatedRessource) {
      throw new Error(
        "La modification n'a pas pu être effectuée. Si cela persiste, contactez vore administrateur",
      );
    }

    return updatedRessource;
  }
}
