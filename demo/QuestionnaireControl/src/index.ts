import { SkillBuilders } from 'ask-sdk-core';
import { Control } from '../../..//src/controls/Control';
import { QuestionnaireControl } from '../../../src/commonControls/questionnaireControl/QuestionnaireControl';
import { ControlManager } from '../../../src/controls/ControlManager';
import { ControlHandler } from '../../../src/runtime/ControlHandler';
import { DemoRootControl } from '../../Common/src/DemoRootControl';

export namespace MultipleLists {
    export class DemoControlManager extends ControlManager {
        createControlTree(): Control {
            const rootControl = new DemoRootControl({ id: 'root' });

            // Call it MultiListControl?
            //  list one is "what day": mon, tues, wed
            //  list two is "how many?": a few, lots.

            // Call it ManyListsControlWithSameChoices?... one 'list' but with lots of different questions associated.
            //   -- must be short lists.
            //   -- each list is an (id,targets) pair with associated
            //   prompts/reprompt/aplMappers
            //   Keep it as questionnaire for now and describe is as 'like a multi-list
            //   but with many special aspects'/

            rootControl.addChild(
                new QuestionnaireControl({
                    id: 'healthScreen',
                    slotType: 'FrequencyAnswer', // todo: add filtered type.
                    questionnaireData: {
                        questions: [
                            {
                                id: 'headache',
                                targets: ['headache'],
                                promptFragment: 'Do you frequently have a headache?',
                            },
                            {
                                id: 'cough',
                                targets: ['cough'],
                                promptFragment: 'Have you been coughing a lot?',
                            },
                            {
                                id: 'troubleSleeping',
                                targets: ['troubleSleep'],
                                promptFragment: 'Do you have trouble sleeping?',
                            },
                            {
                                id: 'soreToe',
                                targets: ['soreToe'],
                                promptFragment: 'Do you have a sore toe?',
                            },
                            {
                                id: 'soreFoot',
                                targets: ['soreFoot'],
                                promptFragment: 'Do you have a sore foot?',
                            },
                            {
                                id: 'soreLeg',
                                targets: ['soreLeg'],
                                promptFragment: 'Do you have a sore leg?',
                            },
                            {
                                id: 'soreKnee',
                                targets: ['soreKnee'],
                                promptFragment: 'Do you have a sore knee?',
                            },
                        ],
                        choices: [
                            {
                                id: 'often',
                                aplColumnHeader: 'Often',
                                promptFragment: 'often',
                            },
                            { id: 'rarely', aplColumnHeader: 'Infreq', promptFragment: 'infrequently' },
                        ], // TODO: should be consistent with ListControl. listItemIds vs choices.

                        //These are special support so that we can offer automatic
                        //handling of YesIntent/NoIntent.

                        choiceForYesUtterance: 'often',
                        choiceForNoUtterance: 'rarely',
                    },
                    interactionModel: {
                        targets: ['builtin_it', 'healthQuestionnaire'], // this should just be the control targets.  The question targets are in content.
                    },
                    // questionRenderer: (questionId: string) =>
                    //     (({
                    //         headache: 'Do you frequently have a headache?',
                    //         cough: 'Have you been coughing a lot?',
                    //     } as any)[questionId]),
                    // choiceRenderer: (choiceId: string) =>
                    //     (({
                    //         often: 'often or always',
                    //         rarely: 'rarely or never',
                    //     } as any)[choiceId]),
                }),
            );

            return rootControl;
        }
    }
}

export const handler = SkillBuilders.custom()
    .addRequestHandlers(new ControlHandler(new MultipleLists.DemoControlManager()))
    .lambda();
