import { Control, ControlInput, ControlResponseBuilder } from '../..';
import { ContentAct } from '../../systemActs/ContentActs';
import { InitiativeAct } from '../../systemActs/InitiativeActs';
import { QuestionnaireControl, QuestionnaireUserAnswers } from './QuestionnaireControl';
import { QuestionnaireContent } from './QuestionnaireControlStructs';

export interface AskQuestionPayload {
    // business data
    questionnaireContent: QuestionnaireContent;
    answers: QuestionnaireUserAnswers;
    questionId: string;
}

/**
 * Asks the user one of the questions of the questionnaire.
 *
 */
export class AskQuestionAct extends InitiativeAct {
    control: QuestionnaireControl;
    payload: AskQuestionPayload;

    constructor(control: Control, payload: AskQuestionPayload) {
        super(control);
        this.payload = payload;
    }

    render(input: ControlInput, responseBuilder: ControlResponseBuilder): void {
        throw new Error(
            'this.render() is not implemented. Either override or perform rendering in Control.render()',
        );
    }
}

/**
 * Asks the user if an answer was understood correctly with a yes/no question.
 */
export class ConfirmAnswerToQuestion extends InitiativeAct {
    constructor(control: Control) {
        super(control);
    }

    render(input: ControlInput, responseBuilder: ControlResponseBuilder): void {
        // TODO:lowPri: we could perhaps have a default of "Was that [choice]?"
        throw new Error(
            'this.render() is not implemented. Either override or perform rendering in Control.render()',
        );
    }
}

export interface QuestionAnsweredActPayload {
    questionId: string;
    choiceId: string;

    /**
     * if true, the user gave an explicit answer.
     * if false, the user used a simpler approach, e.g. "yes", "no", or touch
     * 
     * Purpose:
     *  - may help to decide whether to include the answer in the implicit feedback.
     * 
     * Example:
     *  - if true, prompt = "OK, five stars"
     *  - whereas if false, prompt= "OK."
     */
    answeredWithExplicitValue: boolean;
    
    
    /**
     * if true, the user gave the answer out-of-order by mentioning a specific question.
     * if false, the user directly answered the asked question
     * 
     * Purpose:
     *  - may help to decide whether to include the question in the implicit feedback.
     * 
     * Example:
     *  - if true, prompt = "OK, five stars for customer service."
     *  - whereas if false, prompt= "OK."
     */
    mentionedQuestion: boolean;


    renderedQuestion: string;
    renderedQuestionShortForm: string;
    renderedChoice: string;
}

/**
 * Communicates that an answer was received.
 * 
 * Purpose: 
 * - This act provides implicit feedback that an answer was received and may also communicate
 *   the actual answer received.
 */
export class QuestionAnsweredAct extends ContentAct {
    payload: QuestionAnsweredActPayload;
    constructor(control: Control, payload: QuestionAnsweredActPayload) {
        super(control);
        this.payload = payload;
    }

    render(input: ControlInput, responseBuilder: ControlResponseBuilder): void {
        // TODO:lowPri: we could perhaps have a default of "OK."
        throw new Error(
            'this.render() is not implemented. Either override or perform rendering in Control.render()',
        );
    }
}

export class QuestionnaireCompletedAct extends ContentAct {
    render(input: ControlInput, responseBuilder: ControlResponseBuilder): void {
        
        // TODO:lowPri: we could perhaps have a default of "OK."
        throw new Error(
            'this.render() is not implemented. Either override or perform rendering in Control.render()',
        );
    }
}


/**
 * Payload for InvalidValueAct
 */
export interface QuestionnaireCompletionRejectedPayload {
    reasonCode?: string;
    renderedReason?: string;
}

export class QuestionnaireCompletionRejectedAct extends ContentAct {
    payload: QuestionnaireCompletionRejectedPayload;
    constructor(control: Control, payload: QuestionnaireCompletionRejectedPayload) {
        super(control);
        this.payload = payload;
    }
    
    render(input: ControlInput, responseBuilder: ControlResponseBuilder): void {
        
        throw new Error(
            'this.render() is not implemented. Either override or perform rendering in Control.render()',
        );
    }
}
