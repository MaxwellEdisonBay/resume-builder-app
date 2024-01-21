export interface File {
    _id: string,
    userId: string,
    resumeId?: string,
    file: Buffer,
    name: string,
    size: number,
    contentType: string,
}

