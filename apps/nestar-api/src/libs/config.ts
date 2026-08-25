import { ObjectId } from "bson";

export const availableAgentsSorts = ['createdAt', 'updatedAt', 'memberLikes', 'memberViews', 'memberRanks']

export const shapeIntoMongoObjectId = (target: any) => {
  return typeof target === "string" ? new ObjectId(target) : target
};