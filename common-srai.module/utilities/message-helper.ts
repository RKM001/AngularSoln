export enum MessageType {
    NoMessage = 1,
    NoData = 2,
    Error = 3,
    NoDataMigration = 4,
    CustomMessage = 5
}

export class MessageHelper {

    public type: MessageType = MessageType.NoMessage;

    constructor() { }

    public get hasMessageToDisplay(): boolean {
        return this.type !== MessageType.NoMessage;
    }

    public set(type: MessageType = MessageType.NoMessage): void {
        this.type = type;
    }

    public clear(): void {
        this.type = MessageType.NoMessage;
    }
}

export const ErrorMessages = {
    errorTitle: 'APPLICATION_INFORMATION',
    noData: 'lblNodata',
    errorMessage: 'msg_error',
    noDataMigration: 'NO_DATA_MIGRATION',
};

