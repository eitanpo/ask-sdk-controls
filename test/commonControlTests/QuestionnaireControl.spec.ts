/*
 * Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the 'License').
 * You may not use this file except in compliance with the License.
 * A copy of the License is located at
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * or in the 'license' file accompanying this file. This file is distributed
 * on an 'AS IS' BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

import { expect } from 'chai';
import { suite, test } from 'mocha';
import { GeneralControlIntent } from '../../src';
import { QuestionnaireControl } from '../../src/commonControls/questionnaireControl/QuestionnaireControl';
import { Strings } from '../../src/constants/Strings';
import { Control } from '../../src/controls/Control';
import { ControlManager } from '../../src/controls/ControlManager';
import { ControlHandler } from '../../src/runtime/ControlHandler';
import { IntentBuilder } from '../../src/utils/IntentUtils';
import { SkillInvoker } from '../../src/utils/testSupport/SkillInvoker';
import { TestInput, testTurn, waitForDebugger } from '../../src/utils/testSupport/TestingUtils';

waitForDebugger();

// suite('ListControl e2e tests', () => {
//     class ListControlManager extends ControlManager {
//         createControlTree(): Control {
//             return new ListControl({
//                 id: 'apple',
//                 validation: (state, input) =>
//                     ['iPhone', 'iPad', 'MacBook'].includes(state.value!)
//                         ? true
//                         : { renderedReason: 'Apple Suite category validation failed' },
//                 listItemIDs: ['iPhone', 'iPad', 'MacBook'],
//                 slotType: 'AppleSuite',
//                 confirmationRequired: true,
//                 prompts: {
//                     valueSet: '',
//                 },
//             });
//         }
//     }

//     test('product value valid, needs explicit affirming', async () => {
//         const requestHandler = new ControlHandler(new ListControlManager());
//         await testE2E(requestHandler, [
//             'U: iPhone',
//             TestInput.of(SingleValueControlIntent.of('AppleSuite', { AppleSuite: 'iPhone' })),
//             'A: Was that iPhone?',
//             'U: Yeah.',
//             TestInput.of(IntentBuilder.of(AmazonIntent.YesIntent)),
//             'A: Great.',
//         ]);
//     });

//     test('product value after disaffirmation, requires request value act', async () => {
//         const requestHandler = new ControlHandler(new ListControlManager());
//         await testE2E(requestHandler, [
//             'U: iPhone',
//             TestInput.of(SingleValueControlIntent.of('AppleSuite', { AppleSuite: 'iPhone' })),
//             'A: Was that iPhone?',
//             'U: No.',
//             TestInput.of(IntentBuilder.of(AmazonIntent.NoIntent)),
//             'A: My mistake. What is your selection? Some suggestions are iPhone, iPad or MacBook.',
//         ]);
//     });

//     test('product value set and changing it requires confirmation and value changed act', async () => {
//         const requestHandler = new ControlHandler(new ListControlManager());
//         await testE2E(requestHandler, [
//             'U: iPhone',
//             TestInput.of(SingleValueControlIntent.of('AppleSuite', { AppleSuite: 'iPhone' })),
//             'A: Was that iPhone?',
//             'U: Yes.',
//             TestInput.of(IntentBuilder.of(AmazonIntent.YesIntent)),
//             'A: Great.',
//             'U: Change to iPad.',
//             TestInput.of(
//                 SingleValueControlIntent.of('AppleSuite', { AppleSuite: 'iPad', action: $.Action.Change }),
//             ),
//             'A: OK, I changed it to iPad. Was that iPad?',
//             'U: Yes.',
//             TestInput.of(IntentBuilder.of(AmazonIntent.YesIntent)),
//             'A: Great.',
//         ]);
//     });

//     test('product value set and changing it to invalid requires confirmation and checks for validations', async () => {
//         const requestHandler = new ControlHandler(new ListControlManager());
//         const invoker = new SkillInvoker(requestHandler);
//         await testTurn(
//             invoker,
//             'U: iPhone',
//             TestInput.of(SingleValueControlIntent.of('AppleSuite', { AppleSuite: 'iPhone' })),
//             'A: Was that iPhone?',
//         );

//         await testTurn(
//             invoker,
//             'U: Yes.',
//             TestInput.of(IntentBuilder.of(AmazonIntent.YesIntent)),
//             'A: Great.',
//         );

//         await testTurn(
//             invoker,
//             'U: Change to Airpods.',
//             TestInput.of(
//                 SingleValueControlIntent.of('AppleSuite', { AppleSuite: 'Airpods', action: $.Action.Change }),
//             ),
//             'A: Sorry, Airpods is not a valid choice because Apple Suite category validation failed. What should I change it to? Some suggestions are iPhone, iPad or MacBook.',
//         );

//         await testTurn(
//             invoker,
//             'U: iPad',
//             TestInput.of(SingleValueControlIntent.of('AppleSuite', { AppleSuite: 'iPad' })),
//             'A: OK, I changed it to iPad. Was that iPad?',
//         );

//         await testTurn(
//             invoker,
//             'U: No.',
//             TestInput.of(IntentBuilder.of(AmazonIntent.NoIntent)),
//             'A: My mistake. What is your selection? Some suggestions are iPhone, iPad or MacBook.',
//         );

//         await testTurn(
//             invoker,
//             'U: iPad',
//             TestInput.of(SingleValueControlIntent.of('AppleSuite', { AppleSuite: 'iPad' })),
//             'A: OK, I changed it to iPad. Was that iPad?',
//         );

//         await testTurn(
//             invoker,
//             'U: Yes.',
//             TestInput.of(IntentBuilder.of(AmazonIntent.YesIntent)),
//             'A: Great.',
//         );
//     });

//--

suite('QuestionnaireControl e2e tests', () => {
    interface TestProps {
        confirmationRequired: boolean;
    }

    function createControlManager(props: TestProps): ControlManager {
        return new (class extends ControlManager {
            createControlTree(): Control {
                return new QuestionnaireControl({
                    id: 'question',
                    questionnaireData: {
                        questions: [
                            {
                                id: 'headache',
                                targets: ['headache'],
                                prompt: 'Do you frequently have a headache?',
                                visualLabel: 'Do you frequently have a headache?',
                                promptShortForm: 'headache',
                            },
                            {
                                id: 'cough',
                                targets: ['cough'],
                                prompt: 'Have you been coughing a lot?',
                                visualLabel: 'Have you been coughing a lot?',
                                promptShortForm: 'cough',
                            },
                        ],
                        choices: [
                            {
                                id: 'yes',
                                aplColumnHeader: 'Yes',
                                prompt: 'yes',
                            },
                            {
                                id: 'no',
                                aplColumnHeader: 'No',
                                prompt: 'no',
                                selectedCharacter: '✖',
                            },
                        ],
                    },
                    interactionModel: {
                        slotType: 'YesNoMaybe',
                        filteredSlotType: 'Maybe',
                    },
                    dialog: {
                        confirmationRequired: props.confirmationRequired,
                    },
                    prompts: {
                        questionAnsweredAct: '',
                    },
                });
            }
        })();
    }

    test('basics, confirmation=false', async () => {
        const requestHandler = new ControlHandler(createControlManager({ confirmationRequired: false }));
        const invoker = new SkillInvoker(requestHandler);
        await testTurn(
            invoker,
            'U: __',
            TestInput.of(GeneralControlIntent.of({ action: Strings.Action.Start })),
            'A: Do you frequently have a headache?',
        );

        await testTurn(
            invoker,
            'U: yes',
            TestInput.of(IntentBuilder.of('AMAZON.YesIntent')),
            'A: Have you been coughing a lot?',
        );

        await testTurn(
            invoker,
            'U: yes',
            TestInput.of(IntentBuilder.of('AMAZON.YesIntent')),
            'A: Great, thank you.',
        );
    });

    test('basics, confirmation=true', async () => {
        const requestHandler = new ControlHandler(createControlManager({ confirmationRequired: true }));
        const invoker = new SkillInvoker(requestHandler);
        await testTurn(
            invoker,
            'U: __',
            TestInput.of(GeneralControlIntent.of({ action: Strings.Action.Start })),
            'A: Do you frequently have a headache?',
        );

        await testTurn(
            invoker,
            'U: yes',
            TestInput.of(IntentBuilder.of('AMAZON.YesIntent')),
            'A: Have you been coughing a lot?',
        );

        await testTurn(
            invoker,
            'U: yes',
            TestInput.of(IntentBuilder.of('AMAZON.YesIntent')),
            'A: Are you happy with all answers?',
        );
    });

    /**
     * User presses a radio button to answer an arbitrary question.
     * 1. state is updates
     * 2. no voice prompt.
     * 3. no new APL.
     */
    test('answering by touch', async () => {
        const controlManager = createControlManager({ confirmationRequired: false });
        const requestHandler = new ControlHandler(controlManager);
        const invoker = new SkillInvoker(requestHandler);

        const response = await testTurn(
            invoker,
            'U: I cough all the time',
            TestInput.simpleUserEvent(['question', 'radioClick', 'cough', 1]), //questionId='cough', answerIndex=1
            'A: ',
        );

        expect((response.directive = undefined)); // no APL after touch events.  It is already updated on client side.

        expect(requestHandler.getSerializableControlStates().question.value).deep.equals({
            cough: {
                choiceId: 'no',
            },
        });
    });

    // /**
    //  * Ensure that ResponseBuilder.isDisplayUsed is set when ActiveAPLInitiative produced.
    //  */
    // test('ActiveAPLInitiative causes response.isDisplayUsed = true', async () => {
    //     const controlManager = new MultipleLists.DemoControlManager();
    //     const root = controlManager.createControlTree() as ContainerControl;
    //     const questionnaireControl = root.children[0] as QuestionnaireControl;
    //     const touchInput = TestInput.simpleUserEvent(['healthScreen', 'radioClick', 'cough', 1]);
    //     const responseBuilder = new ControlResponseBuilder(ResponseFactory.init());
    //     questionnaireControl.renderAct(
    //         new ActiveAPLInitiativeAct(questionnaireControl),
    //         touchInput,
    //         responseBuilder,
    //     );
    //     expect(responseBuilder.isDisplayUsed()).true; // display marked as used.
    // });
});
