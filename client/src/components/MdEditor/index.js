import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Form } from 'antd';
import SimpleMdeReact from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';
import './index.scss';

function MdEditor(props) {
    const { autosaveId, autosaveItemKey, value } = props;

    const [content, setContent] = useState(value);
    const form = Form.useFormInstance();

    useEffect(() => {
        setContent(localStorage.getItem(autosaveItemKey) || value);
    }, [value, autosaveItemKey]);

    const onChange = useCallback(
        (val) => {
            props.onChange(val);
        },
        [props]
    );

    const options = useMemo(() => {
        const shortcuts = {
            drawTable: 'Ctrl-Alt-T',
            toggleBlockquote: 'Shift-Ctrl-Q',
            toggleCodeBlock: 'Shift-Ctrl-K',
            toggleUnorderedList: 'Shift-Ctrl-[',
            toggleOrderedList: 'Shift-Ctrl-]',
            drawImage: 'Shift-Ctrl-I',
            toggleHeadingSmaller: 'Ctrl--',
            toggleHeadingBigger: 'Ctrl-=',
            toggleHeading1: 'Ctrl-1',
            toggleHeading2: 'Ctrl-2',
            toggleHeading3: 'Ctrl-3',
        };

        const toolbarOthers = {
            name: 'others',
            className: 'fa fa-ellipsis-v',
            title: 'others buttons',
            children: [
                'guide',
                // {
                //   name: "image",
                //   action: "",
                //   className: "fa fa-picture-o",
                //   title: "Image",
                // },
            ],
        };

        const toolbarReadMore = {
            name: 'read-more',
            action: (editor) => {
                var cm = editor.codemirror;
                writeReadMoreTag(cm);
            },
            className: 'fa fa-audio-description',
            title: 'read more(Shift-Ctrl-M)',
        };

        const toolbar = [
            'bold',
            'italic',
            'heading',
            '|',
            'code',
            'quote',
            'unordered-list',
            'ordered-list',
            '|',
            'link',
            'image',
            'table',
            '|',
            'preview',
            'side-by-side',
            'fullscreen',
            '|',
            'horizontal-rule',
            toolbarReadMore,
            toolbarOthers,
        ];

        return {
            minHeight: '72vh',
            maxHeight: '72vh',
            autofocus: true,
            autosave: {
                enabled: true,
                uniqueId: autosaveId,
                delay: 1000,
            },
            // uploadImage: true,
            // imageUploadFunction: imageUploadFunction,
            shortcuts,
            spellChecker: false,
            showIcons: ['code', 'table'],
            tabSize: 2,
            indentWithTabs: false,
            lineNumbers: true,
            lineWrapping: true,
            promptURLs: true,
            toolbar: toolbar,
        };
    }, [autosaveId]);

    const writeReadMoreTag = (cm) => {
        cm.replaceSelection('<!-- More -->');
    };

    const writeLineCode = (cm) => {
        var selection = cm.getSelection();
        const {
            line: linePosition,
            ch: cursorPosition,
            sticky,
        } = cm.getCursor();

        if (sticky === 'after') {
            let start = cursorPosition - 1;
            let end = cursorPosition + selection.length;
            let startChar = cm.getRange(
                { line: linePosition, ch: start },
                { line: linePosition, ch: start + 1 }
            );
            let endChar = cm.getRange(
                { line: linePosition, ch: end },
                { line: linePosition, ch: end + 1 }
            );
            if (startChar === '`' && endChar === '`') {
                cm.replaceRange(
                    selection,
                    {
                        line: linePosition,
                        ch: start,
                    },
                    {
                        line: linePosition,
                        ch: end + 1,
                    }
                );
                return;
            }
        } else if (sticky === 'before') {
            let start = cursorPosition - selection.length - 1;
            let end = cursorPosition;
            let startChar = cm.getRange(
                { line: linePosition, ch: start },
                { line: linePosition, ch: start + 1 }
            );
            let endChar = cm.getRange(
                { line: linePosition, ch: end },
                { line: linePosition, ch: end + 1 }
            );
            if (startChar === '`' && endChar === '`') {
                cm.replaceRange(
                    selection,
                    {
                        line: linePosition,
                        ch: start - 1,
                    },
                    {
                        line: linePosition,
                        ch: end + 1,
                    }
                );
                return;
            }
        } else {
            let start = cursorPosition - 1;
            let end = cursorPosition;
            let startChar = cm.getRange(
                { line: linePosition, ch: start },
                { line: linePosition, ch: start + 1 }
            );
            let endChar = cm.getRange(
                { line: linePosition, ch: end },
                { line: linePosition, ch: end + 1 }
            );
            if (startChar === '`' && endChar === '`') {
                cm.replaceRange(
                    selection,
                    {
                        line: linePosition,
                        ch: start - 1,
                    },
                    {
                        line: linePosition,
                        ch: end + 1,
                    }
                );
                return;
            }
        }

        cm.replaceSelection('`' + selection + '`');
        if (!selection) {
            var currentCursor = cm.getCursor();
            currentCursor.ch = currentCursor.ch - 1;
            cm.setCursor(currentCursor);
        }
    };

    const extraKeys = useMemo(() => {
        return {
            'Shift-Ctrl-S': (cm) => {
                form.submit();
            },
            'Shift-Ctrl-`': function (cm) {
                writeLineCode(cm);
            },
            'Shift-Ctrl-M': function (cm) {
                writeReadMoreTag(cm);
            },
            'Shift-Ctrl-L': function (cm) {
                var selection = cm.getSelection();
                cm.replaceSelection(selection + '<br />');
            },
        };
    }, [form]);

    const events = useMemo(() => {
        return {
            keyHandled: (cm, name, event) => {
                // console.log(
                //     'name=' + name + 'event = ' + event + 'values=' + content
                // );
                // if (name === 'Shift-Ctrl-S') {
                //     submit();
                // }
            },
        };
    }, []);

    return (
        <div>
            <SimpleMdeReact
                value={content}
                options={options}
                extraKeys={extraKeys}
                events={events}
                onChange={onChange}
            />
        </div>
    );
}

export default MdEditor;
