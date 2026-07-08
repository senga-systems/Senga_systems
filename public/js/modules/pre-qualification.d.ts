interface QualificationConfig {
    formId: string;
    containerId: string;
    apiEndpoint: string;
}
declare class PreQualification {
    private config;
    private formElement;
    private containerElement;
    private formData;
    private currentStep;
    private totalSteps;
    constructor(config?: Partial<QualificationConfig>);
    private init;
    private renderForm;
    private getFormHTML;
    private setupEventListeners;
    private nextStep;
    private previousStep;
    private validateCurrentStep;
    private renderStep;
    private updateNavigation;
    private updateProgress;
    private collectFormData;
    private handleSubmit;
    private calculateFitScore;
    private getRecommendation;
    private submitForm;
    private routeToNextStep;
    private focusFirstInput;
    private showError;
    private showSuccess;
    private showMessage;
    private handleError;
}
export default PreQualification;
//# sourceMappingURL=pre-qualification.d.ts.map