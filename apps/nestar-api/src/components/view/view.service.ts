import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { View } from '../../libs/dto/view/view';
import { ViewInput } from '../../libs/dto/view/view.input';
import { T } from '../../libs/types/common';

@Injectable()
export class ViewService {
    constructor(@InjectModel("View") private readonly vievModel:Model<View>){}

     public async recordWiew(input: ViewInput): Promise<View | null>{
       const viewExist = await this.checkViewExistence(input)

       if(!viewExist) {
       console.log("--- NEW View inset ---");
       return await this.vievModel.create(input);
       }else return null
     }

     private async checkViewExistence(input: ViewInput): Promise<View | null> {
       const {memberId, viewRefId} =input;
       const search: T ={ memberId: memberId, viewRefId: viewRefId};
       return await this.vievModel.findOne(search).exec();
     }

}
