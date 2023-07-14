import { dbSource } from "../source";
import { User } from "../entity/user.entity";
import { Repository } from "typeorm";

export class UserController{

    private repository: Repository<User>

    constructor() {
        this.repository = dbSource.getRepository(User)
    }
    
    validateUser(name: string){
        return this.repository.findOneByOrFail({ name })
    }

}