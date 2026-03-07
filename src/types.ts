export interface Member {
    id: string;
    name: string;
    received: number;
    expense: number;
    toGive: number;
    toGet: number;
    remaining: number;
}

export interface Log {
    id: string;
    date: string;
    action: string;
    description: string;
    amount: number;
    splitAmount?: number;
    memberIds: string[];
}

export interface Trip {
    id: string;
    tripName: string;
    isSingleDay: boolean;
    startDate: string;
    endDate: string;
    numberOfDays: number;
    createdAt: string;
    members: Member[];
    logs: Log[];
}

export type ModalType =
    | 'CREATE_TRIP'
    | 'ADD_MEMBER'
    | 'EDIT_MEMBER'
    | 'EDIT_TRIP'
    | 'ADD_EXPENSE'
    | 'ADD_AMOUNT'
    | 'TO_GIVE'
    | 'TO_GET'
    | 'VIEW_TRIP_LOGS'
    | 'VIEW_MEMBER_LOGS'
    | 'CONFIRM_DELETE_TRIP'
    | 'CONFIRM_DELETE_INDIVIDUAL'
    | 'CONFIRM_CLEAR_ALL_TRIPS'
    | 'CONFIRM_RESET_STATS'
    | 'CONFIRM_RESET_MEMBER'
    | 'CONFIRM_DELETE_MEMBER'
    | 'SETTINGS'
    | 'EXPORT_SETTINGS'
    | 'LIMIT_REACHED'
    | null;

export interface ModalState {
    isOpen: boolean;
    type: ModalType;
    data?: any;
}

export interface HistoryEntry {
    action: string;
    state: Trip[];
}
