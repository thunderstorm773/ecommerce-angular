export class AddProduct {

    constructor(public name: string,
                public description: string,
                public unitPrice: number,
                public imageUrl: string,
                public unitsInStock: number,
                public categoryId: number,
                public isActive: boolean) {}
}
