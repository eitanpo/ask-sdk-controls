import { expect } from 'chai';
/*
 * Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * A copy of the License is located at
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * or in the "license" file accompanying this file. This file is distributed
 * on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */
import { suite, test } from 'mocha';
import {
    ControlHandler,
    GeneralControlIntent,
    IntentBuilder,
    SkillInvoker,
    TestInput,
    testTurn,
    waitForDebugger,
} from '../../../src';
import { MultipleLists } from '../src';

waitForDebugger();

suite.only('questionnaire demo skill', () => {
    test('general features', async () => {
        const controlManager = new MultipleLists.DemoControlManager();
        const requestHandler = new ControlHandler(controlManager);
        const invoker = new SkillInvoker(requestHandler);
        const response1 = await testTurn(
            invoker,
            'U: __',
            TestInput.launchRequest(),
            'A: Welcome. Do you frequently have a headache?',
        );

        expect(response1.directive).lengthOf(1);
        expect(response1.directive![0].type).equal('Alexa.Presentation.APL.RenderDocument'); // APL present.

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

        // going back to change an answer.
        await testTurn(
            invoker,
            'U: no cough',
            TestInput.of(
                GeneralControlIntent.of({
                    feedback: 'no',
                    target: 'cough',
                }),
            ),
            'A: OK, no for cough. Are you happy with all answers?',
        );

        await testTurn(
            invoker,
            "U: I'm done",
            TestInput.of(GeneralControlIntent.of({ action: 'builtin_complete' })),
            'A: Great, thank you.',
        );

        expect(requestHandler.getSerializableControlStates().healthScreen.value).deep.equals({
            cough: {
                choiceId: 'no',
            },
            headache: {
                choiceId: 'yes',
            },
        });
    });

    /**
     * User answers one of the questions with "no"
     * Notes:
     *  - The 'no' is understood to be equivalent to "rarely" via control props
     *  - Answering with a bare 'no' does not produce implicit feedback in the prompt as
     *    risk of misunderstanding is low.
     */
    test('bare no', async () => {
        const controlManager = new MultipleLists.DemoControlManager();
        const requestHandler = new ControlHandler(controlManager);
        const invoker = new SkillInvoker(requestHandler);
        const response1 = await testTurn(
            invoker,
            'U: __',
            TestInput.launchRequest(),
            'A: Welcome. Do you frequently have a headache?',
        );

        await testTurn(
            invoker,
            'U: no',
            TestInput.of(IntentBuilder.of('AMAZON.NoIntent')),
            'A: Have you been coughing a lot?',
        );

        expect(requestHandler.getSerializableControlStates().healthScreen.value).deep.equals({
            headache: {
                choiceId: 'no',
            },
        });
    });

    /**
     * User ignores the prompt and directly answers a question of their choosing
     */
    test('answering specific question', async () => {
        const controlManager = new MultipleLists.DemoControlManager();
        const requestHandler = new ControlHandler(controlManager);
        const invoker = new SkillInvoker(requestHandler);
        const response1 = await testTurn(
            invoker,
            'U: __',
            TestInput.launchRequest(),
            'A: Welcome. Do you frequently have a headache?',
        );

        await testTurn(
            invoker,
            'U: I cough all the time',
            TestInput.of(GeneralControlIntent.of({ feedback: 'yes', target: 'cough' })),
            'A: OK, yes for cough. Do you frequently have a headache?',
        );

        expect(requestHandler.getSerializableControlStates().healthScreen.value).deep.equals({
            cough: {
                choiceId: 'yes',
            },
        });
    });

    // TODO.
    // /**
    //  * User ignores the prompt and directly answers a question of their choosing, via an
    //  * alternate value. ie say "I often cough" rather than "yes to cough".
    //  *
    //  * Also TODO: allow the value to come via preposition, cf via feedback.
    //  */
    // test('answering specific question', async () => {
    //     const controlManager = new MultipleLists.DemoControlManager();
    //     const requestHandler = new ControlHandler(controlManager);
    //     const invoker = new SkillInvoker(requestHandler);
    //     const response1 = await testTurn(
    //         invoker,
    //         'U: __',
    //         TestInput.launchRequest(),
    //         'A: Welcome. Do you frequently have a headache?',
    //     );

    //     await testTurn(
    //         invoker,
    //         'U: I cough all the time',
    //         TestInput.of(
    //             SingleValueControlIntent.of('FrequencyAnswer', { target: 'cough', FrequencyAnswer: 'often' }),
    //         ),
    //         'A: OK, often for cough. Do you frequently have a headache?',
    //     );

    //     expect(controlManager.questionnaireControl.state.value).deep.equals({
    //         cough: {
    //             choiceId: 'often',
    //         },
    //     });
    // });
});
