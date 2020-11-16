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

/**
 * The strings associated with various built-ins
 */
export namespace Strings {
    /**
     * Built-in feedback slot values
     */
    export enum Feedback {
        Affirm = 'builtin_affirm',
        Disaffirm = 'builtin_disaffirm',
    }

    /**
     * Built-in action slot values
     */
    export enum Action {
        Set = 'builtin_set',
        Change = 'builtin_change',
        Select = 'builtin_select',
        Start = 'builtin_start',
        Restart = 'builtin_restart',
        Resume = 'builtin_resume',
        GoBack = 'builtin_goBack',
        Complete = 'builtin_complete',
        None = 'builtin_none',
        Add = 'builtin_add',
        Remove = 'builtin_remove',
        Delete = 'builtin_delete',
        Ignore = 'builtin_ignore',
        Replace = 'builtin_replace',
    }

    /**
     * Built-in target slot values
     */
    export enum Target {
        It = 'builtin_it',
        Start = 'builtin_start',
        End = 'builtin_end',
        Choice = 'builtin_choice',
        // eslint-disable-next-line id-blacklist
        Number = 'builtin_number',
        Date = 'builtin_date',
        StartDate = 'builtin_start_date',
        EndDate = 'builtin_end_date',
        DateRange = 'builtin_date_range',
        Questionnaire = 'builtin_questionnaire',
    }

    export const Conjunction = 'builtin_conjunction';
    export const Tail = 'builtin_tail';
    export const Head = 'builtin_head';
    export const Preposition = 'builtin_preposition';
}
