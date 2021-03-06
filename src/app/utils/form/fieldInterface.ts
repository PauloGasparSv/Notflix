export interface Field {
    type: string;
    formControlName: string;
    icon?: string;
    color?: string;
    placeholder?: string;
    required?: boolean;
    minlength?: number;
    maxlength?: number;
    autofocus?: boolean;
    active?: boolean;
    value?: string;
}
