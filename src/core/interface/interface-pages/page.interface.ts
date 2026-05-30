// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface PageInterface {
    data:{
        agencies:BlockInterface,
        circular:BlockInterface,
        customer:BlockInterface,
        sales_service:BlockInterface,
        privacy:BlockInterface,
        rules:BlockInterface,
        security:BlockInterface,
        terms:BlockInterface,
        veteran_registration: BlockInterface,
        call: BlockInterface,
        questions: BlockInterface,
        suggestions: BlockInterface,
    }
    service_meta_tags:MetaTagsInterface[]
}