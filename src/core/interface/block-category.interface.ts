// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface BlockCategoryInterface{
    group:{
        active_categories:BlockCategoryItemInterface[]
    }
}
interface BlockCategoryItemInterface{
    id:number
    image_path:string,
    title:string,
    description:string
}