import type {Meta} from "~/@types/paginate";

export type Author = {
    email: string
}

export type Message = {
    id: Number
    text: string
    author?: Author
    answer?: string
}


export type MessagePaginate = {
    data: Message[]
    meta: Meta
}

export type MessageForm = { text: string }

export type AnswerForm = { answer: string }