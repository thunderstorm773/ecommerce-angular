import { ProductCategory } from "./product-category";

export class ProductAdmin {

    constructor(public id: number,
                public name: string,
                public description: string,
                public category: ProductCategory,
                public unitPrice: number,
                public unitPriceEur: number,
                public image: string,
                public imageUrl: string,
                public isActive: boolean,
                public unitsInStock: number,
                public dateCreated: Date,
                public lastUpdated: Date) {}
}
