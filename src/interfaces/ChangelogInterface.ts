export namespace ChangelogInterface {
    export namespace API {
        export interface Article {
            id: number;
            title: string;
            markdown: string;
            version_number: string;
            version_show: string;
            author: {
                name: string;
                avatar: string;
            };
            created_at: string;
        }
    }
}
