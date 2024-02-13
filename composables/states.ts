import type {User} from "~/@types/user";

export const useLoginRegisterModalIsOpenState = () => useState('login_register_modal_is_open', () => false)
export const useUserState = () => useState('user', (): null | User => null)