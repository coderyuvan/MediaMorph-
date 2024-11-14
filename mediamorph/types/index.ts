export interface Video {
    id: string
    title: string
    description: string
    publicId: string
    originalSize: string // Changed to string
    compressedSize: string
    duration: number
    createdAt: Date
    updatedAt: Date
}
