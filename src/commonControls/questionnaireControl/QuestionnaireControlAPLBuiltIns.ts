import i18next from 'i18next';
import { PresentQuestionnaireAndAskOneQuestionAct, RequestChangedValueByListAct } from '../..';
import { DeepRequired } from '../../utils/DeepRequired';
import { QuestionnaireControlAPLProps } from './QuestionnaireControl';

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

export interface QuestionnaireChoice {
    ordinalText: string;
    selectedText: string;
    color: string;
    selectedIndex: number;
    //unselectedText: string;
    //selectedTextColor: string,
}

export interface QuestionnaireControlAPLContent {
    caption: string;
    questionCaptions: string[];
    choices: QuestionnaireChoice[];
}

export namespace QuestionnaireControlAPLBuiltIns {
    /*
     * For information about the TextListTemplate, see following doc:
     * https://developer.amazon.com/en-US/docs/alexa/alexa-presentation-language/apl-alexa-text-list-layout.html
     */
    export const ScrollingLineItems: DeepRequired<QuestionnaireControlAPLProps> = {
        enabled: true,
        requestValue: {
            document: questionnaireDocumentGenerator(),
            dataSource: questionnaireDataSourceGenerator((choiceId) => choiceId),
            customHandlingFuncs: [],
        },
        requestChangedValue: {
            document: questionnaireDocumentGenerator(),
            dataSource: questionnaireDataSourceGenerator((choiceId) => choiceId),
            customHandlingFuncs: [],
        },
    };

    /**
     * The APL dataSource to use when requesting a value
     *
     * Default: A TextListLayout data source to bind to an APL document.
     * See
     * https://developer.amazon.com/en-US/docs/alexa/alexa-presentation-language/apl-data-source.html
     */
    export function questionnaireDataSourceGenerator(
        slotIdMapper: { [index: string]: string } | ((choiceId: string) => string),
    ) {
        return (act: PresentQuestionnaireAndAskOneQuestionAct) => {
            const itemsArray: QuestionnaireChoice[] = [];
            for (const choice of act.allChoices) {
                itemsArray.push({
                    primaryText:
                        typeof slotIdMapper === 'function' ? slotIdMapper(choice) : slotIdMapper[choice],
                });
            }

            return {
                textListData: {
                    controlId: act.control.id,
                    headerTitle: i18next.t('LIST_CONTROL_DEFAULT_APL_HEADER_TITLE'),
                    items: itemsArray,
                },
            };
        };
    }

    /**
     * The APL document to use when requesting a value
     *
     * Default: Questionnaire items shown as line items with radio buttons for selecting answer
     */
    export function questionnaireDocumentGenerator() {
        return {
            type: 'APL',
            version: '1.4',
            import: [
                {
                    name: 'alexa-layouts',
                    version: '1.2.0',
                },
            ],
            resources: [
                {
                    description: 'RadioButton dimensions',
                    dimensions: {
                        radioButtonDefaultHeight: '72dp',
                        radioButtonDefaultWidth: '72dp',
                    },
                    colors: {
                        radioButtonColorDarkTheme: '@colorBlack',
                    },
                },
                {
                    description: 'RadioButton dimensions - Tv',
                    when: '${@viewportProfileGroup == @tv}',
                    dimensions: {
                        radioButtonDefaultHeight: '48dp',
                        radioButtonDefaultWidth: '48dp',
                    },
                    colors: {
                        radioButtonColorDarkTheme: '@colorBlackTVSafe',
                    },
                },
            ],
            styles: {
                AlexaRadioButtonAVGStyle: {
                    values: [
                        {
                            opacity: 1,
                            isChecked: false,
                        },
                        {
                            when: '${state.disabled}',
                            opacity: '@opacityDisabled',
                        },
                        {
                            when: '${state.checked}',
                            isChecked: true,
                        },
                    ],
                },
            },
            graphics: {
                AlexaRadioButtonAVG: {
                    type: 'AVG',
                    version: '1.0',
                    width: 48,
                    height: 48,
                    parameters: [
                        'fillColorOff',
                        'fillColorOn',
                        'selectorColor',
                        'highlightColorOff',
                        'highlightColorOn',
                        'isFocus',
                        'isChecked',
                    ],
                    items: [
                        {
                            description: 'Radio Button highlight',
                            type: 'group',
                            items: [
                                {
                                    type: 'path',
                                    fillOpacity: '${isFocus ? 0.2 : 0}',
                                    fill: '${isChecked ? highlightColorOn : highlightColorOff}',
                                    pathData:
                                        'M48,24c0,13.255-10.745,24-24,24S0,37.255,0,24S10.745,0,24,0S48,10.745,48,24z',
                                },
                            ],
                        },
                        {
                            description: 'Radio Button unselected state',
                            type: 'group',
                            items: [
                                {
                                    type: 'path',
                                    fill: '${fillColorOff}',
                                    fillOpacity: '${isChecked ? 0 : 1}',
                                    pathData:
                                        'M24,12c-6.627,0-12,5.373-12,12s5.373,12,12,12s12-5.373,12-12S30.627,12,24,12z M24,34\n\t\tc-5.523,0-10-4.477-10-10s4.477-10,10-10s10,4.477,10,10S29.523,34,24,34z',
                                },
                            ],
                        },
                        {
                            description: 'Radio Button selected state',
                            type: 'group',
                            opacity: '${isChecked ? 1 : 0}',
                            items: [
                                {
                                    type: 'path',
                                    fill: '${fillColorOn}',
                                    pathData:
                                        'M36,24c0,6.627-5.373,12-12,12s-12-5.373-12-12s5.373-12,12-12S36,17.373,36,24z',
                                },
                                {
                                    type: 'path',
                                    fill: '${selectorColor}',
                                    pathData:
                                        'M30,24c0,3.314-2.686,6-6,6s-6-2.686-6-6s2.686-6,6-6S30,20.686,30,24z',
                                },
                            ],
                        },
                    ],
                },
            },
            layouts: {
                AlexaRadioButton: {
                    parameters: [
                        {
                            name: 'theme',
                            description:
                                'Colors will be changed depending on the specified theme (light/dark). Defaults to dark theme.',
                            type: 'string',
                            default: 'dark',
                        },
                        {
                            name: 'primaryAction',
                            description: 'The command that is triggered when the radioButton is selected.',
                            type: 'any',
                        },
                        {
                            name: 'accessibilityLabel',
                            description:
                                'Voice over will read this string when the user selects this component.',
                            type: 'string',
                        },
                        {
                            name: 'radioButtonHeight',
                            description: 'Height of the radioButton',
                            type: 'dimension',
                            default: '@radioButtonDefaultHeight',
                        },
                        {
                            name: 'radioButtonWidth',
                            description: 'Width of the radioButton',
                            type: 'dimension',
                            default: '@radioButtonDefaultWidth',
                        },
                        {
                            name: 'radioButtonColor',
                            description: 'Selected color of the radioButton',
                            type: 'color',
                            default: "${theme != 'light' ? @colorAccent : '#1CA0CE'}",
                        },
                        {
                            name: 'entities',
                            description: 'Array of entity data bind to this layout',
                            type: 'any',
                        },
                        {
                            name: 'isChecked',
                            type: 'any',
                        },
                        {
                            name: 'text',
                            type: 'any',
                        },
                    ],
                    item: {
                        type: 'TouchWrapper',
                        width: '${radioButtonWidth}',
                        height: '${radioButtonHeight}',
                        accessibilityLabel: '${accessibilityLabel}',
                        style: 'AlexaRadioButtonAVGStyle',
                        bind: [
                            {
                                name: 'fillColorOff',
                                type: 'color',
                                value: "${theme != 'light' ? @colorGray500 : @colorGray600}",
                            },
                            {
                                name: 'highlightColorOff',
                                type: 'color',
                                value: "${theme != 'light' ? @colorGray500 : @colorGray600}",
                            },
                            {
                                name: 'selectorColor',
                                type: 'color',
                                value: "${theme != 'light' ? @radioButtonColorDarkTheme : @colorWhite}",
                            },
                        ],
                        onPress: [
                            {
                                type: 'SetValue',
                                property: 'checked',
                                value: '${!event.source.checked}',
                            },
                            '${primaryAction}',
                        ],
                        onFocus: [
                            {
                                type: 'SetValue',
                                property: 'isFocus',
                                value: true,
                            },
                        ],
                        onBlur: [
                            {
                                type: 'SetValue',
                                property: 'isFocus',
                                value: false,
                            },
                        ],
                        onDown: [
                            {
                                type: 'SetValue',
                                property: 'isFocus',
                                value: true,
                            },
                        ],
                        onUp: [
                            {
                                type: 'SetValue',
                                property: 'isFocus',
                                value: false,
                            },
                        ],
                        items: [
                            {
                                type: 'Text',
                                text: "${isChecked ? text : '&#9675;'}",
                                color: '${radioButtonColor}',
                            },
                        ],
                    },
                },
                QuestionRadio: {
                    parameters: ['index', 'color'],
                    item: {
                        type: 'AlexaRadioButton',
                        spacing: '40px',
                        radioButtonColor: '${color}',
                        height: '60',
                        width: '60',
                        isChecked: '${selectedBtnIndex==index}',
                        onPress: ['${primaryAction}'],
                        primaryAction: {
                            type: 'Sequential',
                            commands: [
                                {
                                    type: 'SetValue',
                                    property: 'selectedBtnIndex',
                                    value: '${index}',
                                },
                                {
                                    type: 'SetValue',
                                    property: 'selectedBtnIndex',
                                    value: '${index}',
                                },
                            ],
                        },
                    },
                },
                question: {
                    parameters: ['idx', 'text', 'selectedBtnIndex'],
                    item: {
                        type: 'Container',
                        direction: 'row',
                        alignItems: 'start',
                        justifyContent: 'start',
                        items: [
                            {
                                type: 'Text',
                                text: '${idx}',
                            },
                            {
                                type: 'Container',
                                direction: 'row',
                                spacing: '50px',
                                items: [
                                    {
                                        type: 'QuestionRadio',
                                        text: '✔',
                                        index: 0,
                                        textColor: '#00FF00',
                                    },
                                    {
                                        type: 'QuestionRadio',
                                        text: '✖',
                                        index: 1,
                                        color: '#FF0000',
                                    },
                                    {
                                        type: 'QuestionRadio',
                                        text: '?',
                                        index: 2,
                                        color: '#555555',
                                    },
                                ],
                            },
                            {
                                paddingLeft: '50px',
                                type: 'Text',
                                text: '${text}',
                            },
                        ],
                    },
                },
            },
            mainTemplate: {
                parameters: ['payload'],
                items: [
                    {
                        type: 'Container',
                        items: [
                            {
                                type: 'Text',
                                text: '${payload.wrapper.metadata.title}',
                            },
                            {
                                type: 'Text',
                                text:
                                    '&#32;&#32;&#32;&#32;&#32;&#32;&#32;&#32;&#32;&#32;&#32;&#32;&#32;Yes No Maybe',
                            },
                            {
                                type: 'ScrollView',
                                height: '100vh',
                                width: '100vw',
                                checked: true,
                                position: 'relative',
                                onMount: [
                                    {
                                        type: 'ScrollToIndex',
                                        componentId: 'textToUpdate',
                                        index: '${payload.wrapper.metadata.focusIndex}',
                                        align: 'center',
                                    },
                                ],
                                item: [
                                    {
                                        type: 'Sequence',
                                        height: '100vh',
                                        width: '100vw',
                                        id: 'textToUpdate',
                                        paddingLeft: '@marginHorizontal',
                                        paddingRight: '@marginHorizontal',
                                        items: '${payload.wrapper.itemData}',
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        };
    }
}