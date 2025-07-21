export class Product {

    constructor(public id: number,
                public name: string,
                public description: string,
                public unitPrice: number,
                public unitPriceEur: number,
                public imageUrl: string,
                public isActive: boolean,
                public unitsInStock: number,
                public dateCreated: Date,
                public lastUpdated: Date
    ) {

    }
}
