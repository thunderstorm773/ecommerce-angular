export class ProductComment {

    constructor(public id: number,
                public content: string,
                public username: string,
                public userFullname: string,
                public dateCreated: Date) {}
}
