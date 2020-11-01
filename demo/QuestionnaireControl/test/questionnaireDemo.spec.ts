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
    SingleValueControlIntent,
    SkillInvoker,
    TestInput,
    testTurn,
    waitForDebugger,
} from '../../../src';
import { MultipleLists } from '../src';

waitForDebugger();

suite('all', () => {
    test.only('Questionnaire Demo', async () => {
        const requestHandler = new ControlHandler(new MultipleLists.DemoControlManager());
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
            'A: OK. Have you been coughing a lot?',
        );

        await testTurn(
            invoker,
            'U: I cough all the time',
            TestInput.of(
                SingleValueControlIntent.of('FrequencyAnswer', { target: 'cough', FrequencyAnswer: 'often' }),
            ),
            'A: OK, often for cough. Do you have trouble sleeping?',
        );

        // going back to change an answer.
        await testTurn(
            invoker,
            'U: no, I never cough',
            TestInput.of(
                SingleValueControlIntent.of('FrequencyAnswer', {
                    target: 'cough',
                    FrequencyAnswer: 'rarely',
                }),
            ),
            'A: OK, infrequently for cough. Do you have trouble sleeping?',
        );

        await testTurn(
            invoker,
            "U: I'm done",
            TestInput.of(GeneralControlIntent.of({ action:  'complete' })),
            'A: OK.',
        );

        // await testTurn(
        //     invoker,
        //     'U: cat',
        //     TestInput.of(SingleValueControlIntent.of('PetBreed', { PetBreed: 'persian' })),
        //     'A: OK, persian. What is your selection? Some suggestions are adopt, foster or sponsor.',
        // );
    });
});
