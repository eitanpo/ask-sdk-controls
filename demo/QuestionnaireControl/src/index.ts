import { SkillBuilders } from 'ask-sdk-core';
import { Control } from '../../..//src/controls/Control';
import { QuestionnaireControl } from '../../../src/commonControls/questionnaireControl/QuestionnaireControl';
import { ControlManager } from '../../../src/controls/ControlManager';
import { ControlHandler } from '../../../src/runtime/ControlHandler';
import { DemoRootControl } from '../../Common/src/DemoRootControl';

export namespace MultipleLists {
    export class DemoControlManager extends ControlManager {

        questionnaireControl = new QuestionnaireControl({
            id: 'healthScreen',
            slotType: 'FrequencyAnswer',
            questionnaireData: {
                questions: [
                    {
                        id: 'headache',
                        targets: ['headache'],
                        prompt: 'Do you frequently have a headache?',
                        //TODO: APL string.
                        promptShortForm: 'headache',
                    },
                    {
                        id: 'cough',
                        targets: ['cough'],
                        prompt: 'Have you been coughing a lot?',
                        promptShortForm: 'cough',
                    },
                ],
                choices: [
                    {
                        id: 'often',
                        aplColumnHeader: 'Freq',
                        prompt: 'often',
                    },
                    {
                        id: 'rarely',
                        aplColumnHeader: 'Infreq',
                        prompt: 'infrequently',
                        selectedCharacter: '✖',
                    },
                    {
                        id: 'skip',
                        aplColumnHeader: 'Skip',
                        prompt: 'skip',
                        selectedCharacter: '-',
                    },
                ], // TODO: should be consistent with ListControl. listItemIds vs choices.

                //These are special support so that we can offer automatic
                //handling of YesIntent/NoIntent.
                
                choiceForYesUtterance: 'often',
                choiceForNoUtterance: 'rarely',
            },
            interactionModel: {
                targets: ['builtin_it', 'healthQuestionnaire'], // this should just be the control targets.  The question targets are in content.
            }                    
        });



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

            rootControl.addChild(this.questionnaireControl);

            return rootControl;
        }
    }
}

export const handler = SkillBuilders.custom()
    .addRequestHandlers(new ControlHandler(new MultipleLists.DemoControlManager()))
    .lambda();
