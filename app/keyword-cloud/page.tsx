"use client"

import React, { useEffect, useState } from 'react';
import KeywordCloud from "@/components/keywords/KeywordWordCloud.tsx";
import {Keyword} from "@/types";


const KeywordsPage: React.FC = () => {
    const [keywords, setKeywords] = useState<Keyword[]>([]);

    useEffect(() => {
        const fetchKeywords = async () => {
            try {
                const response = await fetch('/api/keywords-frequent');
                const data = await response.json();
                if (response.ok) {
                    setKeywords(data);
                } else {
                    console.error('Error fetching keywords:', data.error);
                }
            } catch (error) {
                console.error('Error fetching keywords:', error);
            }
        };

        fetchKeywords();
    }, []);

    return (
        <div>
            <KeywordCloud keywords={keywords} />
        </div>
    );
};

export default KeywordsPage;
