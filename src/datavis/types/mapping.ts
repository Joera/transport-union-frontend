// export interface Mapping {

//     label: string | boolean,
//     column: string | string[] | boolean,
//     colour?: string | boolean,
//     group?: string | boolean,
//     short?: string,
//     outflow?: any,
//     duration?: string,
//     units? : string
// }

export interface Mapping {

    label: string,
    column: string | string[],
    scale?: string,
    colour?: string,
    group?: string,
    short?: string,
    outflow?: any,
    duration?: string,
    units? : string
    format? : string
}


export interface IGraphMappingV3 {

    slug: string,
    // graph: string
    args?: string[],
    parameters: Mapping[][],
    // header: string,
    // description: string,
    // endpoint: string | boolean,
    // segment: string | boolean,
    // segmentIndicator?: boolean,
    // elementClasslist: string[],
    // publishDate?: string,
    // municipalitySelect?: boolean
}

export type IMappingOption = Mapping | boolean;
