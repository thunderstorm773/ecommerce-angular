export class SystemParameter {

    constructor(public id: number,
                public code: string,
                public value: string,
                public description: string,
                public dateCreated: Date,
                public lastUpdated: Date) {}
}
