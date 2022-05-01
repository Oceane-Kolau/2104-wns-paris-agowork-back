import {
    Resolver,
    Query,
    Arg,
    Mutation,
    Authorized,
    ID,
  } from "type-graphql";
import { User } from "../../models/userModel/user.schema";
import { Ressource, RessourceModel } from "../../models/ressourceModel/ressource.schema";
import RessourceInput from "../../models/ressourceModel/ressource.input";
  
  @Resolver(Ressource)
  export default class RessourceResolver {
    @Authorized(["ADMIN", "TEACHER"])
    @Mutation(() => Ressource)
    async createRessource(@Arg("input") input: RessourceInput): Promise<Ressource> {
     
      const ressource = new RessourceModel ({
        ...input
      }).save();
  
      return ressource;
    }
  
    @Authorized(['ADMIN', 'TEACHER'])
    @Mutation(() => Ressource, { nullable: true })
    async deleteRessource(@Arg("id", () => ID) id: string) {
      const deletedRessource = await RessourceModel.findByIdAndDelete(id);
      if (!deletedRessource) throw new Error('Aucune ressource ne correspond à la demande');
      return deletedRessource;
    }
  
    @Authorized(['ADMIN', 'TEACHER'])
    @Query(() => [Ressource])
    async getAllRessources(): Promise<Ressource[]> {
      const ressources = await RessourceModel.find().sort({updatedAt: -1});
      return ressources;
    }

    @Authorized(['ADMIN'])
    @Query(() => Ressource, { nullable: true })
    async getRessourceById(@Arg("id", () => ID) id: string) {
      const ressource = await RessourceModel.findById(id);
      if (!ressource) throw new Error('Aucune ressource ne correspond à la demande');
      return ressource;
    }
  }
  