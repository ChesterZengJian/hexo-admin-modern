import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Form } from 'antd';
import SimpleMdeReact from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';
import './index.scss';

function MdEditor(props) {
    const { value } = props;
    const [content, setContent] = useState(value);
    const form = Form.useFormInstance();

    useEffect(() => {
        setContent(value);
    }, [value]);

    const onChange = useCallback(
        (val) => {
            props.onChange(val);
        },
        [props]
    );

    const options = useMemo(() => {
        return {
            autofocus: true,
        };
    }, []);

    const submit = useCallback(() => {
        form.submit();
    }, [form]);

    const extraKeys = useMemo(() => {
        return {
            'Shift-Ctrl-S': (cm) => {
                submit();
            },
        };
    }, [submit]);

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
