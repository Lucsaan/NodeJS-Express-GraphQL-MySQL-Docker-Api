import { IResolvers } from 'graphql-tools';
import { Database} from "./database";
import { User } from './entity/User';
import "reflect-metadata";


const database = Database.getInstance();
const uuid = require('uuid/v4');

const resolverMap: IResolvers = {
    Query: {
        helloWorld(_: void, args: void): string {
            return `👋 Hello world! 👋`;
        },
       users: () => {
            return new Promise( resolve => {
               database.connect().then(async (connection: any) => {
                  let userRepo = connection.getRepository(User);
                  let _users = await userRepo.find();
                  resolve(_users);
               });
            });
       }
    },
    Mutation: {
        createUser: (_, {name} ) => {
            let user = new User();
            user.name = name;
            user.id = uuid();
            // @ts-ignore
            return new Promise((resolve, reject) =>{
                database.connect().then(async (connection: any) => {
                    let userRepo = connection.getRepository(User);

                    let _user = await userRepo.findOne({name: name});
                    if(!_user) {
                        await userRepo.save(user);
                        console.log('user saved');
                        resolve(user);
                    } else {
                        reject(new Error('name is used'));
                    }
                });
            });
        }
    }
};
export default resolverMap;
