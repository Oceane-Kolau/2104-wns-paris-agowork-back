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
     
      const body = {
        title: input.title,
        link: input.link,


      };
      const ressource = await(await RessourceModel.create(body)).save();
      return ressource;
    }
  
    @Authorized(['ADMIN', 'TEACHER'])
    @Mutation(() => Ressource, { nullable: true })
    async deleteUser(@Arg("id", () => ID) id: string) {
      const user = await RessourceModel.findByIdAndDelete(id);
      if (!user) throw new Error('Aucun utilisateur ne correspond à la demande');
      return user;
    }
  
    @Authorized(['ADMIN'])
    @Query(() => [Ressource])
    async getAllUsers(): Promise<Ressource[]> {
      const ressources = await RessourceModel.find().sort({updatedAt: -1});
      return ressources;
    }

    @Authorized(['ADMIN'])
    @Query(() => User, { nullable: true })
    async getUserById(@Arg("id", () => ID) id: string) {
      const user = await RessourceModel.findById(id);
      if (!user) throw new Error('Aucune ressource ne correspond');
      return user;
    }
  }
  