export class EditProduct {

    constructor(public name: string,
                public description: string,
                public unitPrice: number,
                public image: File,
                public unitsInStock: number,
                public categoryId: number,
                public isActive: boolean) {}
}
