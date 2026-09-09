import { ObjectId } from "bson";
import { T } from './types/common';

export const availableAgentsSorts = ['createdAt', 'updatedAt', 'memberLikes', 'memberViews', 'memberRanks']
export const availableMemberSorts = ['createdAt', 'updatedAt', 'memberLikes', 'memberViews']
export const availableOptions =[ 'propertyBarter','propertyRent' ]
export const availablePropertySorts =[
   'createdAt',
   'updatedAt',
   'propertyLikes',
   'propertyViews',
   'propertyRank',
   'propertyPrice'
];
export const availableBoardArticleSorts = ['createdAt', 'updatedAt', 'articleLikes', 'articleViews']
export const availableCommentSorts =['createdAt', 'updatedAt'];



/**  IMAGE CONFIGURATION  **/
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

export const validMimeTypes = ['image/png', 'image/jpg', 'image/jpeg'];
export const getSerialForImage = (filename: string) => {
	const ext = path.parse(filename).ext;
	return uuidv4() + ext;
};

export const shapeIntoMongoObjectId = (target: any) => {
  return typeof target === "string" ? new ObjectId(target) : target
};

export const lookupAuthMemberLiked = (memberId: T, targetRefId: string = '$_id') => {
	return {
		$lookup: { //MongoDB’da boshqa collection bilan bog‘lanish boshlanadi
			from: 'likes', //Ma’lumot likes collection ichidan qidiriladi.
			let: {
				localLikeRefId: targetRefId, //qaysi obyekt tekshirilmoqda
				localMemberId: memberId, //qaysi foydalanuvchi tekshirilmoqda
				localMyFavorite: true, //like topilsa qaytariladigan true qiymati
			},
			pipeline: [
				{
					$match: {
						$expr: {
							$and: [
								{ $eq: ['$likeRefId', '$$localLikeRefId'] },//Bu like yozuvini ikki shart bilan qidiradi
								{ $eq: ['$memberId', '$$localMemberId'] }, //kkalasi ham mos kelsa, demak shu foydalanuvchi shu obyektga like bosgan.
							],
						},
					},
				},
				{
					$project: {
						_id: 0,
						memberId: 1,
						likeRefId: 1,
						myFavorite: '$$localMyFavorite',//Frontendga foydalanuvchi shu obyektga like bosganini ko‘rsatadigan ma’lumot beradi:
					},//Shu orqali yurakcha qizil yoki faol holatda ko‘rsatiladi
				},
			],
			as: 'meLiked',
		},
	};
};

interface lookupAuthMemberFollowed {
	followerId: T;
	followingId: string
}


export const lookupAuthMemberFollowed = (input: lookupAuthMemberFollowed ) => {
	const {followerId, followingId} =input
	return {
		$lookup: {
			from: 'follows',
			let: {
				localFollowerId: followerId,
				localFollowingId: followingId,
				localMyFollowing: true,
			},
			pipeline: [
				{
					$match: {
						$expr: {
							$and: [
								{ $eq: ['$followerId', '$$localFollowerId'] },
								{ $eq: ['$followingId', '$$localFollowingId'] },
							],
						},
					},
				},
				{
					$project: {
						_id: 0,
						followerId: 1,
						followingId: 1,
						myFollowing: '$$localMyFollowing',
					},
				},
			],
			as: 'meFollowed',
		},
	};
};



export const lookupMember = { //Moongos query sintaksisda ishlatamz

	$lookup: {

    from: "members",
	  localField: "memberId",
	  foreignField: "_id",
	  as: "memberData"

	}

}

export const lookupFollowingData = {
  
  	$lookup: {

    from: "members",
	  localField: "followingId",
	  foreignField: "_id",
	  as: "followingData"

	}

}

export const lookupFollowerData = {
  
  	$lookup: {

    from: "members",
	  localField: "followerId",
	  foreignField: "_id",
	  as: "followerData"

	}

}

export const lookupFavorite = {
  
  	$lookup: {

    from: "members",
	  localField: "favoriteProperty.memberId",
	  foreignField: "_id",
	  as: "favoriteProperty.memberData"

	}

}


export const lookupVisit = {
  
  	$lookup: {

    from: "members",
	  localField: "visitedProperty.memberId",
	  foreignField: "_id",
	  as: "visitedProperty.memberData"

	}

}
