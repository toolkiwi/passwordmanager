import type { VaultInterface } from '@/interfaces/VaultInterface';

interface UsePasswordFormValidationProps {
    form: VaultInterface.Form.Password;
    defaultForm: VaultInterface.Form.Password;
    mode: 'create' | 'edit';
}

export const usePasswordFormValidation = ({ form, defaultForm, mode }: UsePasswordFormValidationProps) => {
    const isRequiredFieldsValid = !!(form.password?.trim() && form.title?.trim());
    /**
     * TOTP validation
     */
    const isTotpValid =
        !form.totp || !!(form.totp.secret?.trim() && form.totp.digits && form.totp.period && form.totp.algorithm);
    /**
     * Check if form is modified
     */
    const isFormModified = mode === 'create' || JSON.stringify(form) !== JSON.stringify(defaultForm);

    /**
     * Disable save button if required fields are not valid, TOTP is invalid, or form is not modified (in edit mode)
     */
    const isSaveDisabled = !isRequiredFieldsValid || !isTotpValid || !isFormModified;
    /**
     * Return validation states
     */
    return {
        isRequiredFieldsValid,
        isTotpValid,
        isFormModified,
        isSaveDisabled,
    };
};
