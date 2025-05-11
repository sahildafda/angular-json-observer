export interface ProjectData {
    Id: number;
    Name: string;
    Datas: {
        SamplingTime: string;
        Properties: {
            Label: string;
            Value: string | number | boolean;
        }[];
    }[];
}
