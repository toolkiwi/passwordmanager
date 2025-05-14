import { VaultInterface } from './VaultInterface';

export namespace TagFormInterface {
    export interface FormFieldUpdate {
        field: keyof VaultInterface.Form.Tag;
        value: string;
    }

    export interface ColorPicker {
        FormFieldUpdate: (
            field: TagFormInterface.FormFieldUpdate['field'],
            value: TagFormInterface.FormFieldUpdate['value'],
        ) => void;
        form: VaultInterface.Form.Tag;
    }

    export interface Select {
        onChange: (tag_id: VaultInterface.Tag['id']) => void;
        value?: undefined | VaultInterface.Tag['id'];
    }
}
