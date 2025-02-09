export interface homeBtn {
    id?: string,
    title: string,
    name: string,
    action: () => void,
    imageUrl?: string,
    status: 'Enable' | 'Disabled',
    class?: string
}