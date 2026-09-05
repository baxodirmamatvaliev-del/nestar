import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { View } from '../../libs/dto/view/view';
import { ViewInput } from '../../libs/dto/view/view.input';
import { T } from '../../libs/types/common';
import { OrdinaryInquiry } from '../../libs/dto/property/property.input';
import { ViewGroup } from '../../libs/enums/view.enum';
import { Properties } from '../../libs/dto/property/property';
import { lookupVisit } from '../../libs/config';

@Injectable()
export class ViewService {
    constructor(@InjectModel("View") private readonly viewModel:Model<View>){}

     public async recordView(input: ViewInput): Promise<View | null>{
       const viewExist = await this.checkViewExistence(input)

       if(!viewExist) {
       console.log("--- NEW View inset ---");
       return await this.viewModel.create(input);
       }else return null
     }

     private async checkViewExistence(input: ViewInput): Promise<View | null> {
       const {memberId, viewRefId} =input;
       const search: T ={ memberId: memberId, viewRefId: viewRefId};
       return await this.viewModel.findOne(search).exec();
     }

     public async getVisitedProperties(memberId: Types.ObjectId, input:OrdinaryInquiry): Promise<Properties>{
           const {page, limit} = input
           const match: T = {viewGroup: ViewGroup.PROPERTY, memberId: memberId}
     
           const data: T = await this.viewModel
           .aggregate([
             { $match: match },
             { $sort: {updatedAt: -1 }}, // oxirgi korgan PROPERTY mizni 1 chi chiqarib berishni aytapmz
             {
                 $lookup: {
                     from: "properties",
                     localField: "viewRefId",
                     foreignField: "_id",
                     as: "visitedProperty",
                 },
             },
             { $unwind: "$visitedProperty" },
             {
                 $facet: {
                     list: [
                         { $skip: (page-1)*limit},
                         { $limit: limit},
                         lookupVisit, //$favoriteProperty hosil qilgan member ni data sini olyapmz
                         { $unwind: "$visitedProperty.memberData" } // memberData ni array ❌
                     ],
                     metaCounter: [{ $count: 'total' }],
                 }
             }
           ])
           .exec();
     
           const result: Properties  ={ list: [], metaCounter: data[0].metaCounter}
           result.list = data[0].list.map((ele) => ele.visitedProperty); //$favoriteProperty qiymatini yahlitlab oldik . bu bizga Propoerties yani biz like bosgan larimizni beradi
           console.log("result:" ,result)
           return result
         }

}
