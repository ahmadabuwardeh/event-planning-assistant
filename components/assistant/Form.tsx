'use client';

import React, { useState, FormEvent } from "react";
import { BiMenu } from "react-icons/bi";
import { MdSend } from "react-icons/md";
import { FormProps } from "@/types";


const Form: React.FC<FormProps> = ({ handleSendMessage, close }) => {
    const [userTypings, setUserTypings] = useState<string>("");

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        handleSendMessage(e, () => setUserTypings(''));
    };

    return (
        <form id="form_input_data" className="msger-inputarea" onSubmit={onSubmit}>
            <input
                name="prompt"
                type="text"
                value={userTypings}
                onChange={(e) => setUserTypings(e.target.value)}
                className="msger-input"
                placeholder="Ask any question here..."
            />
            <button type="submit" className="msger-send-btn">
                <MdSend className="icon_size" />
            </button>
        </form>
    );
};

export default Form;
