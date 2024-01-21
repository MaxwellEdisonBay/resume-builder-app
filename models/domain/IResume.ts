

export interface IResume {
    _id: string,
    name: string,
    userId: string,
    sections: string[],
    pdfOutputBinary?: string,
    sampleId?: string,
    updatedAt?: string,
    downloads?: {
        pdf?: string
    }
}