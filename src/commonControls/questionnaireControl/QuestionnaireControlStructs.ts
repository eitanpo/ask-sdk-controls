export interface Question {
    /**
     * Identifier
     */
    id: string;

    /**
     * Target-slot values associated with this question.
     *
     * For example, assume the user says "yes I like cats", and appropriate action and
     * target are configured in the interaction model
     *
     * ```
     * -- slotTypeValue added to the 'target' slotType.
     * {
     *  id: 'cat',
     *  name: {
     *    value: 'cats'
     *    synonyms: ['kitty', 'kitties']
     *  }
     * }
     *
     * -- slotTypeValue added to the 'action' slotType.
     * {
     *  id: 'like',
     *  name: {
     *    value: 'like'
     *    synonyms: ['like', 'I like', 'adore', 'I adore', 'fond', 'fond of', 'I\'m fond of']
     *  }
     * }
     * ```
     * and the action & target are registered as a target for the "AskIfLikeCats"
     * question.
     *
     * The input 'yes I like cats' will be parsed by NLU as a `GeneralControlIntent` with
     * slot values `feedback = affirm` and `action = like` and `target = cats`. This intent
     * will be interpreted by the Questionnaire Control as an answer to the question 'Do
     * you like cats?'
     *
     * Default: `['builtin_it']`
     *
     * Usage:
     * - If this prop is defined, it replaces the default; it is not additive to the
     *   defaults.  To add an additional target to the defaults, copy the defaults and
     *   amend.
     * - A question can be associated with many target-slot-values, eg ['like cats',
     *   'likeIt']
     * - It is a good idea to associate with general targets (e.g. `builtin_it`) and also with
     *   specific targets (e.g. `cats`) so that the user can say either general or
     *   specific things.  e.g. 'yes I like them', or 'I want my vacation to start on Tuesday'.
     * - The association does not have to be exclusive, and general target slot values
     *   will often be associated with many controls. In situations where there is
     *   ambiguity about what the user is referring to, the parent controls must resolve
     *   the confusion.
     * - The 'builtin_*' IDs are associated with default interaction model data (which can
     *   be extended as desired). Any other IDs will require a full definition of the
     *   allowed synonyms in the interaction model.
     *
     * Control behavior:
     * - A control will not handle an input that mentions a target that is not registered
     *   by this prop.
     *
     */
    targets: string[];

    /**
     * Rendered form of the question for use in prompts.
     *
     * - This prompt should be a complete sentence with leading uppercase and trailing question-mark.
     *
     * Examples: 'Do you like cats?', 'How do you rate the service?'
     */
    prompt: string;

    /**
     * Short-form rendering of the question for use in prompts.
     *
     * This prompt should be a phrase without leading uppercase and no punctuation.
     *
     * Example:
     *  When providing implicit confirmation, the short form of the question may be used:
     * ```
     *  questionPrompt: "Do you like cats?"
     *  questionPromptShortForm: "cats"
     * ```
     * So that a prompt can be constructed like "OK, yes for cats.  [next question]"
     *
     */
    promptShortForm: string;
}

export interface Choice {
    /**
     * Identifier
     */
    id: string;

    /**
     * A short (1-3 character) form to use as APL column headers.
     */
    aplColumnHeader: string;

    /**
     * Rendered form of the choice for use in prompts.
     *
     * - Rendered form should be a short phrase without punctuation.
     *
     * Examples: 'like', 'do not like'
     * Example prompt:  'Did you say [like]?'
     */
    prompt: string;

    /**
     * Text-character to display when selected
     */
    selectedCharacter?: string;

    /**
     * Text-character to display when not selected
     */
    unselectedCharacter?: string;
}

export interface QuestionnaireContent {
    /**
     * Questions that form the questionnaire.
     */
    questions: Question[];

    /**
     * Choices that the user can choose from.
     *
     * Usage:
     * - Each item should be a slot-value-id from the props.answersSlotType.
     * - The possible answers must be the same for all questions.
     */
    choices: Choice[];

    /**
     * The implied choiceID if the user answers 'yes' to one of the questions.
     *
     * Default: The last element of `choices` array, i.e. `choice[len-1]`
     *
     * Purpose:
     *  - main questionnaires will ask yes/no type questions (possibly with additional
     *    choices).  If this prop is set, the control will automatically handle 'U: No'
     *    and treat it as choosing the configured choice.
     * Example:
     * ```
     * APL:
     *    Frequently   Infrequently
     *      [  ]          [  ]         Go to the shops
     *      [  ]          [  ]         Shop online
     *      [  ]          [  ]         Use recurring orders
     *
     * A: Do you frequently do xyz?
     * U: yes --> equivalent to selecting 'frequently' or saying 'frequently'
     *
     * ```
     *
     */
    choiceForYesUtterance?: string;

    /**
     * The implied choiceID if the user answers 'no' to one of the questions.
     *
     * Default: The last element of `choices` array, i.e. `choice[len-1]`
     *
     * Purpose:
     *  - main questionnaires will ask yes/no type questions (possibly with additional
     *    choices).  If this prop is set, the control will automatically handle 'U: No'
     *    and treat it as choosing the configured choice.
     * Example:
     * ```
     * APL:
     *    Frequently   Infrequently
     *      [  ]          [  ]         Go to the shops
     *      [  ]          [  ]         Shop online
     *      [  ]          [  ]         Use recurring orders
     *
     * A: Do you frequently do xyz?
     * U: yes --> equivalent to selecting 'frequently' or saying 'frequently'
     *
     * ```
     *
     */
    choiceForNoUtterance?: string;
}

// export interface RenderedQuestionnaireContent {
//     /**
//      * Simple rendering for each question, by ID.
//      *
//      * Used in default prompts/APL and available for use in custom prompts.
//      */
//     questions: {[key: string]: string};

//     /**
//      * Simple rendering for each choice, by ID.
//      *
//      * Used in default prompts/APL and available for use in custom prompts.
//      */
//     choices: {[key: string]: string};
// }

/**
 * Indicates the user's answer to a question and whether there is a perceived risk of misunderstanding.
 */
export class QuestionnaireLineItemAnswer {
    questionId: string;
    answerId: string;
    atRiskOfMisunderstanding: boolean;

    constructor(questionId: string, answerId: string, atRiskOfMisunderstanding: boolean) {
        this.questionId = questionId;
        this.answerId = answerId;
        this.atRiskOfMisunderstanding = atRiskOfMisunderstanding;
    }
}
